import * as _ from 'lodash';
import { AuthService } from './shared/auth/auth.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { LOGIN_CONSTANTS } from './user/login/constants/constants';
import { MESSAGE_CONSTANTS } from './constants/constants';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Usuario } from './shared/types/usuario';
import { UserService } from './user/user.service';

@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})

export class AppComponent implements OnInit {
  public loginObservable: Observable<Usuario>;
  public logoutObservable: Observable<boolean>;
  public messages: any[];
  private userInfo: Usuario;

  ngOnInit() {
    this.messages = [];
    this.getUserInfo();
    let message_keys: Array<any>;
    message_keys = _.union(Object.keys(MESSAGE_CONSTANTS), Object.keys(LOGIN_CONSTANTS));
    for (let key of message_keys) {
      this.translate.get(key).subscribe((messageContent: string) => {
        this.messages[key] = messageContent;
      });
    }
  }

  constructor(private translate: TranslateService, public toastr: ToastsManager,
    private authService: AuthService,
    private userService: UserService,
    private viewContainerRef: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(viewContainerRef);
    translate.setDefaultLang('es');
    translate.use('es');
    this.listenToLoginObservable();
    this.listenToLogoutObservable();
  }

  /**
   * @description - Observable listening for an user login
   */
  public listenToLoginObservable() {
    this.loginObservable = this.authService.getLoggedInSubject()
      .subscribe((userData: Usuario) => {
        if (userData !== null) {
          this.getUserInfo();
          this.toastr.success(this.messages[LOGIN_CONSTANTS.LOGIN_WELCOME_TO_OPM as any],
            this.messages[MESSAGE_CONSTANTS.APP_SUCCESS_TITLE as any]);
        }
      });
  }

  /**
  * @description - Observable listening for an user logout
  */
  public listenToLogoutObservable() {
    this.logoutObservable = this.authService.getLogoutSubject().subscribe((result: boolean) => {
      if (result) {
        this.userInfo = undefined;
      }
    });
  }

  private getUserInfo(): void {
    this.userInfo = this.userService.getLocalUserData();
  }
}
