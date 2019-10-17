import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Restangular } from 'ngx-restangular';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Cuenta } from '../shared/types/cuenta';

const EMPRESA_URL: string = 'empresa';
const MENU_URL: string = 'menus';
const REPORTE_URL: string = 'reporte';
const FORMULARIO_URL: string = 'formulario';
const SECTOR_URL: string = 'sector';
const TAMANIO_URL: string = 'tamanio';

@Injectable()
export class EmpresaService {
   

    constructor(private restAngular: Restangular,
        private toastr: ToastsManager) {
    }

    public obtenerMenus(): Observable<any[]> {
        return this.restAngular
            .all(EMPRESA_URL)
            .all(MENU_URL)
            .customGET()
            .map(this.extractDataRestangular)
            .catch(this.handleError);
    }

    public obtenerReporte(idFormulario: number): Observable<any[]> {
        return this.restAngular
            .all(EMPRESA_URL)
            .all(REPORTE_URL)
            .one(FORMULARIO_URL, idFormulario)
            .customGET()
            .map(this.extractDataRestangular)
            .catch(this.handleError);
    }

    public obtenerFormulario(idFormulario: number): Observable<any[]> {
        return this.restAngular
            .all(EMPRESA_URL)
            .one(FORMULARIO_URL, idFormulario)
            .customGET()
            .map(this.extractDataRestangular)
            .catch(this.handleError);
    }

    public putFormulario(idFormulario: number, formulario: any): Observable<any[]> {
        return this.restAngular
            .all(EMPRESA_URL)
            .one(FORMULARIO_URL, idFormulario)
            .customPUT(formulario)
            .map(this.extractDataRestangular)
            .catch(this.handleError);
    }

    public crearEmpresa(registro: Cuenta): Observable<any[]> {
        return this.restAngular
            .all(EMPRESA_URL)
            .customPOST(registro)
            .map(this.extractDataRestangular)
            .catch(this.handleError);
    }

    public obtenerSectores(): Observable<any[]> {
        return this.restAngular
            .all(EMPRESA_URL)
            .all(SECTOR_URL)
            .customGET()
            .map(this.extractDataRestangular)
            .catch(this.handleError);
    }

    public obtenerTamaniosEmpresa(): Observable<any[]> {
        return this.restAngular
            .all(EMPRESA_URL)
            .all(TAMANIO_URL)
            .customGET()
            .map(this.extractDataRestangular)
            .catch(this.handleError);
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
