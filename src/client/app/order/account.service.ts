import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Rx';
import { Account } from '../shared/types/account';

const USERS_BASE_URL: string = 'users';
const ACCOUNT_BASE_URL: string = 'accounts';

@Injectable()
export class AccountService {

    constructor(private restAngular: Restangular) {
    }

    /**
       * @description Gets account data
       * @returns {Observable<Account[]>}
       */
    public getAccounts(): Observable<Account[]> {
        return this.restAngular.all(USERS_BASE_URL).all(ACCOUNT_BASE_URL).customGET()
            .map(this.extractDataRestangular)
            .catch(this.handleError);
    }

    /**
     * @description - Extracts the data from the response
     * @param {any} response - Response
     * @return {any} - Body data
     */
    public extractDataRestangular(response: any): any {
        return response;
    }

    /**
     * @description - Handles the error if the backend sends a code different from the 200 range
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
