import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MAIN_MENU_CONSTANTS } from './constants/mainMenu.constants';
import { UserService } from '../user/user.service';
import { AuthService } from '../shared/auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../shared/types/usuario';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LOGIN_CONSTANTS } from '../user/login/constants/constants';
import { MESSAGE_CONSTANTS } from '../constants/constants';
import * as _ from 'lodash';
@Component({
    moduleId: module.id,
    selector: 'mgit-main-menu',
    templateUrl: 'mainMenu.component.html',
    styleUrls: ['mainMenu.component.css'],
})

export class MainMenuComponent implements OnInit {
    public userName: object;
    public loginObservable: Observable<Usuario>;
    public logoutObservable: Observable<boolean>;
    public userInfo: Usuario;
    private messages: any;

    ngOnInit() {
        let message_keys: Array<any>;
        message_keys = _.union(Object.keys(MESSAGE_CONSTANTS), Object.keys(LOGIN_CONSTANTS), Object.keys(MAIN_MENU_CONSTANTS));
        for (let key of message_keys) {
            this.translateService.get(key).subscribe((messageContent: string) => {
                this.messages[key] = messageContent;
            });
        }
        this.getUserInfo();
        this.listenToLoginObservable();
        this.listenToLogoutObservable();
    }


    constructor(private translateService: TranslateService,
        private translate: TranslateService,
        private toastr: ToastsManager,
        private authService: AuthService,
        private userService: UserService) {
        this.userName = { name: '' };
        this.messages = {};
    }

    /**
     * @description - Observable listening for an user login
     */
    public listenToLoginObservable() {
        this.loginObservable = this.authService.getLoggedInSubject()
            .subscribe((userData: Usuario) => {
                if (userData !== null) {
                    this.getUserInfo();
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
        if (this.userInfo) {
            let userName = this.userInfo.idRol;
            this.userName = { name: userName };
        }
    }

    private logout(): void {
        this.toastr.info(this.messages[LOGIN_CONSTANTS.LOGOUT_OPM as any], this.messages[MESSAGE_CONSTANTS.APP_INFORMATION_TITLE as any]);
        this.authService.logout(true);
    }
}
