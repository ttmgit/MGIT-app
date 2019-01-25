import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Rx';
import { Order } from  '../shared/types/order';
import { OrderRequest } from '../shared/types/order-request';

const ORDER_BASE_URL: string = 'order';
const ACCOUNT_BASE_URL: string = 'account';
const ALL_BASE_URL: string = 'all';

@Injectable()
export class OrderService {

  constructor(private restAngular: Restangular) {
  }

  /**
   * @description Get products
   */
  public getOrders(): Observable<Order[]> {
    return this.restAngular.all(ORDER_BASE_URL).all(ALL_BASE_URL).customGET()
      .map(this.extractDataRestangular)
      .catch(this.handleError);
  }

  /**
   * @description - Sends orders data to be created
   * @param {OrderRequest} - order
   * @param {number} accountId - account ID
   */
  public createOrder(order: OrderRequest, accountId: number): Observable<any> {
    return this.restAngular.all(ORDER_BASE_URL).one(ACCOUNT_BASE_URL, accountId).customPOST(order)
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
