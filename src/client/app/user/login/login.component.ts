import * as _ from 'lodash';
import { AuthService } from '../../shared/auth/auth.service';
import { Component, OnInit, Inject } from '@angular/core';
import { COMPONENT_VARIABLE } from '@angular/platform-browser/src/dom/dom_renderer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LOGIN_CONSTANTS } from './constants/constants';
import { MESSAGE_CONSTANTS } from '../../constants/constants';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TokenResponseInterface } from '../../shared/auth/token-response.interface';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../user.service';
import { Usuario } from '../../shared/types/usuario';
import { Router } from '@angular/router';
import { ROLES } from '../../shared/constants/roles.constants';

@Component({
    moduleId: module.id,
    selector: 'opm-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'],
})

export class LoginComponent implements OnInit {

    public loginForm: FormGroup;
    public messages: any[];


    constructor(private formBuilder: FormBuilder,
        private router: Router,
        private translateService: TranslateService,
        private authService: AuthService,
        private userService: UserService,
        public toastr: ToastsManager
    ) {
        this.messages = [];
        this.initializeLoginForm();
    }

    public ngOnInit() {
        this.isLoggedIn();
        let message_keys: Array<any>;
        message_keys = _.union(Object.keys(MESSAGE_CONSTANTS), Object.keys(LOGIN_CONSTANTS));
        for (let key of message_keys) {
            this.translateService.get(key).subscribe((messageContent: string) => {
                this.messages[key] = messageContent;
            });
        }
    }


    /**
     * @description - Initializes loginForm
    */
    public initializeLoginForm(): void {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])]
        });
    }

    /**
     * @description - Handles the submit action and performs the login action
     * showing a message if there´s an error
     */
    public onEnter(): void {
        let username: string = this.loginForm.value.username || '';
        let password: string = this.loginForm.value.password || '';
        this.authService.login(username, password).flatMap((token: TokenResponseInterface) => {
            this.authService.setToken(token.access_token);
            this.authService.setRefreshToken(token.refresh_token);
            // After getting the access token, we gather user info
            return this.userService.getUserInformation();
        }).subscribe((userData: Usuario) => {
            this.authService.setUserInfo(userData);
        }, (error) => {
            this.toastr.error(this.messages[LOGIN_CONSTANTS.LOGIN_INVALID_USER_OR_PASSWORD as any],
                this.messages[MESSAGE_CONSTANTS.APP_ERROR_TITLE as any]);
        });
    }

    public isLoggedIn(): void {
        let user = this.userService.getLocalUserData();
        if(user){
            if(user.idRol == ROLES.ADMIN) {
                this.router.navigate(['visualizar-empresas']);
            } else if (user.idRol == ROLES.EMPRESA) {
                this.router.navigate(['reporte', 5]);
            } else {
                this.userService.logout();
            }
        }
    }

}
