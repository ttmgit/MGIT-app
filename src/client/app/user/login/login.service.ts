import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Restangular } from 'ngx-restangular';

const RESPONSE_CONSTRUCTOR_NAME = 'Response';
const USERS_BASE_URL: string = 'users';
const USER_INFO_BASE_URL: string = 'info';

@Injectable()
export class LoginService {

    constructor(private restAngular: Restangular) {
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
