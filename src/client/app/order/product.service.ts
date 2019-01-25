import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Rx';
import { Product } from '../shared/types/product';

const PRODUCT_BASE_URL: string = 'product';
const CATEGORY_BASE_URL: string = 'category';

@Injectable()
export class ProductService {

  constructor(private restAngular: Restangular) {
  }

  /**
   * @description Get products
   * @param {number} categoryId 
   */
  public getProducts(categoryId: number): Observable<Product[]> {
    return this.restAngular
      .all(PRODUCT_BASE_URL)
      .one(CATEGORY_BASE_URL, categoryId).customGET()
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
