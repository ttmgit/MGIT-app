import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Config } from '../index';
import { TokenResponseInterface } from './token-response.interface';
import { Subject } from 'rxjs/Subject';
import { CustomQueryEncoderHelper } from './custom.query.enconder.helper';
import { Usuario } from '../types/usuario';
import { Router } from '@angular/router';
import { ROLES } from '../constants/roles.constants';

const REFRESH_TOKEN_GRANT: string = 'refresh_token';
const GRANT_TYPE_KEY: string = 'grant_type';
const USERNAME_KEY: string = 'username';
const PASSWORD_KEY: string = 'password';
const CLIENT_ID_KEY: string = 'client_id';
const CLIENT_SECRET_KEY: string = 'client_secret';
const USER_INFO_KEY: string = 'userInfo';
const FORM_URL_ENCODED = { 'Content-Type': 'application/x-www-form-urlencoded' };
const TOKEN_LENGTH: number = 40;
const UNCONFIRMED_USER: string = '';
const DEFAULT_VALUE_UNCONFIRMED_USER: string = '';

@Injectable()
export class AuthService {

    private isLoggedInSubject: any;
    private logoutSubject: any;
    private grant_type: string;
    private unregisterSubject: Subject<any>;

    public constructor(private http: Http, private router: Router) {
        this.grant_type = 'password';
        this.isLoggedInSubject = new Subject<any>();
        this.logoutSubject = new Subject<boolean>();
        this.unregisterSubject = new Subject<any>();
    }

    /**
     * @description Returns the subject that indicates if the user was logged out
     * as an observable
     * @returns {Observable<boolean>}
     */
    public getLogoutSubject() {
        return this.logoutSubject.asObservable();
    }

    /**
     * @description Returns the subject that indicates if there were any
     * changes on the userInfo localstorage
     * @returns {Observable<T>}
     */
    public getLoggedInSubject() {
        return this.isLoggedInSubject.asObservable();
    }

    /**
     * @description Wrapper method to set the user info and update the
     * observable with the next sequence
     * @param userInfo
     */
    public setUserInfo(userInfo: Usuario) {
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
        this.isLoggedInSubject.next(userInfo);
        if(userInfo){
            if(userInfo.idRol == ROLES.ADMIN) {
                this.router.navigate(['visualizar-empresas']);
            } else if (userInfo.idRol == ROLES.EMPRESA) {
                this.router.navigate(['reporte']);
            } else {
                this.logout(true);
            }
        }
    }

    /**
     * @description Wrapper method to get the user info and update the
     * observable with what it got from the localStorage
     */
    public getUserStatus() {
        let savedUserData = localStorage.getItem(USER_INFO_KEY);
        if (savedUserData !== undefined) {
            this.isLoggedInSubject.next(JSON.parse(savedUserData));
        }
    }

    /**
     * @description Returns the subject indicating if any were starts without unregister
     * @return {Observable<any>}
     */
    public getUnregisterSubject(): Observable<any> {
        return this.unregisterSubject.asObservable();
    }

    /**
     * @description Set unconfirmed user information
     */
    public setUnConfirmedUser(): void {
        localStorage.setItem(UNCONFIRMED_USER, DEFAULT_VALUE_UNCONFIRMED_USER);
        this.unregisterSubject.next();
    }

    /**
     * @description Clear var unconformed user in localstorage
     */
    public deleteUnconfirmedUser(): void {
        localStorage.removeItem(UNCONFIRMED_USER);
    }

    /**
     * @description gets unconfirmed user information from localstorage
     * @return {string} User localstorage
     */
    public getUnConfirmedUser(): string {
        return localStorage.getItem(UNCONFIRMED_USER);
    }

    /**
     * @description Wrapper method to logout and update the observable
     * with a null sequence
     * @param {boolean} forcedLogout - If the logout was forced because the token
     * was mismatched (true) or was defined by the user (false)
     */
    public logout(forcedLogout: boolean) {
        localStorage.clear();
        this.router.navigate(['']);
        this.isLoggedInSubject.next(null);
        this.logoutSubject.next(forcedLogout);
    }

    /**
     * @description Gets the authentication token from local storage
     * @returns {string|null}
     */
    public getToken(): string {
        let token = localStorage.getItem(Config.TOKEN_LOCATION);
        if (token === null) {
            return null;
        }
        if (token.length !== TOKEN_LENGTH) {
            return null;
        }
        return token;
    }

    /**
     * @description Sets the authentication token on the localstorage
     * @param {string} token - The authentication token
     */
    public setToken(token: string): void {
        if (token.length !== TOKEN_LENGTH) {
            localStorage.setItem(Config.TOKEN_LOCATION, '');
        } else {
            localStorage.setItem(Config.TOKEN_LOCATION, token);
        }

    }

    /**
     * @description Gets the refresh token from local storage
     * @returns {string|null}
     */
    public getRefreshToken(): string {
        let token = localStorage.getItem(Config.REFRESH_TOKEN_LOCATION);
        if (token === null) {
            return null;
        }
        if (token.length !== TOKEN_LENGTH) {
            return null;
        }
        return token;
    }

    /**
     * @description Sets the refresh token on the localstorage
     * @param {string} token - The authentication token
     */
    public setRefreshToken(refresh_token: string): void {
        localStorage.setItem(Config.REFRESH_TOKEN_LOCATION, refresh_token);
    }

    /**
     * @description Gets tokens from OAuth Authorization server. The parameters
     * are sent by using the application/x-www-form-urlencoded format as especified
     * by the OAuth RFC.
     * @param {string} username - Username used to login
     * @param {string} password - Password used to login
     * @returns {Observable<TokenResponseInterface>} - Response object wth authentication
     * and refresh token
     */
    public login(username: string, password: string): Observable<TokenResponseInterface> {
        let authParams = new URLSearchParams('', new CustomQueryEncoderHelper());
        let headers = new Headers(FORM_URL_ENCODED);
        let options = new RequestOptions({ headers: headers });
        authParams.set(GRANT_TYPE_KEY, this.grant_type);
        authParams.set(USERNAME_KEY, username);
        authParams.set(PASSWORD_KEY, password);
        authParams.set(CLIENT_ID_KEY, Config.CLIENT_ID);
        authParams.set(CLIENT_SECRET_KEY, Config.CLIENT_SECRET);
        return this.http.post(Config.API + '/oauth', authParams, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * @description Tries to refresh tokens from OAuth Authorization server. The parameters
     * are sent by using the application/x-www-form-urlencoded format as especified
     * by the OAuth RFC.
     * @returns {Observable<TokenResponseInterface>} - Response object wth authentication
     * and refresh token
     */
    public refreshToken(): Observable<TokenResponseInterface> {
        let refreshParams = new URLSearchParams();
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        refreshParams.set(GRANT_TYPE_KEY, REFRESH_TOKEN_GRANT);
        refreshParams.set(REFRESH_TOKEN_GRANT, this.getRefreshToken());
        refreshParams.set(CLIENT_ID_KEY, Config.CLIENT_ID);
        refreshParams.set(CLIENT_SECRET_KEY, Config.CLIENT_SECRET);
        return this.http.post(Config.API + '/oauth', refreshParams, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**
     * @description Custom response handler to save the token
     * @param response
     * @returns {any}
     */
    public extractData(response: any): any {
        let body = response.json();
        localStorage.setItem(Config.TOKEN_LOCATION, body.access_token);
        localStorage.setItem(Config.REFRESH_TOKEN_LOCATION, body.refresh_token);
        return body || {};
    }

    /**
     * @description Saves the tokens received by the login method
     * and returns the response object
     * @param response
     */
    public extractTokenCustomHandler(response: any): any {
        return response;
    }

    /**
     * @description Handles the error if the backend sends a code different from the 200 range
     * @param {Response|any} error - Error given by the backend
     * @returns {any} - Throws an error and logs it into the console
     */
    public handleError(error: Response | any) {
        let errMsg: string;
        if (!(error._body instanceof ProgressEvent)) {
            const body = error.json() || '';
            errMsg = body.error_description;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }


}
