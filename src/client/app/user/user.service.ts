import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Restangular } from 'ngx-restangular';
import { Usuario } from '../shared/types/usuario';
import { GENERAL } from '../shared/constants/general.constants';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from '../shared/auth/auth.service';
import { Cuenta } from '../shared/types/cuenta';

const RESPONSE_CONSTRUCTOR_NAME = 'Response';
const USERS_BASE_URL: string = 'users';
const USER_INFO_BASE_URL: string = 'info';

@Injectable()
export class UserService {
    public readonly USER_INFO_KEY: string = 'userInfo';

    constructor(private restAngular: Restangular,
        private toastr: ToastsManager,
        private authService: AuthService) {
    }


    /**
     * @description Gets user's information
     * @returns {Observable<any>}
     */
    public getUserInformation(): Observable<Usuario> {
        return this.restAngular
            .all(USERS_BASE_URL)
            .all(USER_INFO_BASE_URL)
            .customGET()
            .map(this.extractDataRestangular)
            .catch(this.handleError);
    }

    public putUsuario(usuario: Cuenta): Observable<Usuario> {
        return this.restAngular
            .all(USERS_BASE_URL)
            .customPUT(usuario)
            .map(this.extractDataRestangular)
            .catch(this.handleError);
    }

    /**
     * @description Wrapper method to set the user info and update the
     * observable with the next sequence
     * @param userInfo
     */
    public setUserInfo(userInfo: Usuario) {
        localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
    }

    /**
     * @description Wrapper method to set the user info and update the
     * observable with the next sequence
     * @param userInfo
     */
    public getLocalUserData(): Usuario {
        return JSON.parse(localStorage.getItem(this.USER_INFO_KEY));
    }

    public logout(): void {
        this.toastr.info('Salir', GENERAL.APP_INFORMATION_TITLE);
        this.authService.logout(true);
    }

    /**
     * @description Extracts the data from the response
     * @param {any} response - Response
     * @return {any} Body data
     */
    public extractDataRestangular(response: any): any {
        return response;
    }

    /**
     * @description Handles the data extraction from what the backend gives us as a response
     * @param {Response | any } response - The response object
     * @returns {any} - Whatever type the backend gives (in this case PostDocument), parsing and casting is handled
     * by the observable methods that call this
     */
    public extractData(response: Response | any): any {
        let body = response.json();
        return body;
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
            return Observable.throw(body);
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

}
