import { Injectable } from '@angular/core';
import { Order } from '../../shared/types/order';
import { Product } from '../../shared/types/product';
import * as moment from 'moment';

@Injectable()
export class PrintOrderService {

    private selectedOrder: Order;

    constructor() {
    }

    /**
     * @description Set Values to print the format
     * @param {Order} order
     */
    public setOrder(order: Order): void {
        this.selectedOrder = order;
    }

    /**
     * @description - Creates a new page to print order
     */
    public print(): void {
        let idOrder = this.selectedOrder.id;
        let accountName = this.selectedOrder.account[0].name;
        let accountCode = this.selectedOrder.account[0].accountCode;
        let requestPerson = this.selectedOrder.requestPerson;
        let orderDate = moment(this.selectedOrder.orderDate).format("DD/MM/YYYY HH:mm");
        let orderDeliveryDate = moment(this.selectedOrder.optimalDeliveryDate).format('DD/MM/YYYY');
        let products = this.selectedOrder.product;
        let total = 0;
        let itemsSubtotal;
        let productsRows = '';
        let popupWindow;
        products.forEach((itemProduct: Product) => {
            total += itemProduct._pivot_quantity;
            itemsSubtotal = itemProduct._pivot_quantity * itemProduct.itemsByCase;
            productsRows += `<tr>
                        <td class="centerColumn">${itemProduct.sku}</td>
                        <td>${itemProduct.shortDescription}</td>
                        <td>${itemProduct._pivot_quantity}</td>
                        <td>${itemsSubtotal}</td>
                        <td>${itemProduct.supplier}</td>
                        <td>Sin Asignar</td>
                        <td class="centerColumn">${itemProduct.productHandling}</td>
                      </tr>`;
        });
        popupWindow = window.open('', '_blank', 'top=0,left=0,width=1024,height=720');
        popupWindow.document.open();
        popupWindow.document.write(`
    <html>
      <head>
          <style>
                * {background-color: white!important;}
                *,
                *::before,
                *::after {
                    box-sizing: border-box;
                }

                html {
                    font-family: sans-serif;
                    line-height: 1.15;
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                    -ms-overflow-style: scrollbar;
                    -webkit-tap-highlight-color: transparent;
                }
                body {
                    margin: 0;
                    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
                    font-size: 1rem;
                    font-weight: 400;
                    line-height: 1.5;
                    color: #212529;
                    text-align: left;
                    background-color: #fff;
                }
                .centerColumn {text-align: center;}
                .printable{font-size:.7em!important}
                .printable table{font-size:1em!important}
                .printable td{padding:0!important}
                .printable p{margin:0!important}
                .printable img{height:55px}
                .row {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -ms-flex-wrap: wrap;
                    flex-wrap: wrap;
                    margin-right: -15px;
                    margin-left: -15px;
                }             
                .col-md-3, .col-md-5, .col-md-12 {
                    position: relative;
                    width: 100%;
                    min-height: 1px;
                    padding-right: 15px;
                    padding-left: 15px;
                }
                .col-md-3 {
                    -webkit-box-flex: 0;
                    -ms-flex: 0 0 25%;
                    flex: 0 0 25%;
                    max-width: 25%;
                }
                .col-md-5 {
                    -webkit-box-flex: 0;
                    -ms-flex: 0 0 41.666667%;
                    flex: 0 0 41.666667%;
                    max-width: 41.666667%;
                }
                .col-md-12 {
                    -webkit-box-flex: 0;
                    -ms-flex: 0 0 100%;
                    flex: 0 0 100%;
                    max-width: 100%;
                } 
                table {
                    border-collapse: collapse;
                    width: 100%;
                    max-width: 100%;
                    margin-bottom: 1rem;
                    background-color: transparent;
                }

                .table th,
                .table td {
                    padding: 0.75rem;
                    vertical-align: top;
                    border-top: 1px solid #dee2e6;
                }

                .table thead th {
                    vertical-align: bottom;
                    border-bottom: 2px solid #dee2e6;
                }

                .table tbody + tbody {
                    border-top: 2px solid #dee2e6;
                }

                .table .table {
                    background-color: #fff;
                }
                .table-striped tbody tr:nth-of-type(odd) {
                    background-color: rgba(0, 0, 0, 0.05);
                }
                * {background-color: white!important;}
                .centerColumn {text-align: center;}
                .printable{font-size:.7em!important}
                .printable table{font-size:1em!important}
                .printable td{padding:0!important}
                .printable p{margin:0!important}
                .printable img{height:55px}
                label {
                    display: inline-block;
                    max-width: 100%;
                    margin-bottom: 5px;
                    font-weight: 700 !important;
                }
                h5{
                    font-size: 14px;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    font-family: inherit;
                    font-weight: 100;
                    line-height: 1.1;
                    color: inherit;
                }
            </style>
      </head>
      <body onload="window.print();" class="printable">
          <div class="row">
              <div class="col-md-3 centerColumn"><img src="images/3B.png" alt="" width="90" height="90"></div>
              <div class="col-md-6 centerColumn">
                  <h3>Comprobante de Requisición de Artículos Congelados</h3>
              </div>
              <div class="col-md-3 centerColumn"><img src="images/FRESCO_LOGO.png" alt="" width="90" height="90"></div>
          </div>
          <div class="row">
              <div class="col-md-5">
                  <h5><label>Número de Solicitud:</label> ${idOrder}</h5>
              </div>
              <div class="col-md-5">
                  <h5><label>Tienda Solicitante:</label> ${accountName} Tienda: ${accountCode}</h5>
              </div>
          </div>
          <div class="row">
              <div class="col-md-5">
                  <h5><label>Nombre Solicitante:</label> ${requestPerson}</h5>
              </div>
              <div class="col-md-3">
                  <h5><label>Fecha Expedición:</label> ${orderDate}</h5>
              </div>
              <div class="col-md-3">
                  <h5><label>Fecha Entrega:</label> ${orderDeliveryDate}</h5>
              </div>
          </div>
          <div class="row">
              <div class="col-md-12">
                  <div id="tableImpr">
                      <table class="table table-striped">
                          <tbody>
                              <tr>
                                  <th>Clave de Producto</th>
                                  <th>Descripción de Producto</th>
                                  <th>Cajas Solicitadas</th>
                                  <th>Piezas Solicitadas</th>
                                  <th>Origen</th>
                                  <th>Estatus</th>
                                  <th>Tipo de Carga</th>
                              </tr>
                              ${productsRows}
                              <tr></tr>
                          </tbody>
                      </table>
                      <h5> <strong> Total de Cajas: </strong> ${total}</h5>
                      <p></p>
                  </div><br><br>Aviso de Privacidad: 10-20 Logistics SAPI de C.V. hace de su conocimiento que de acuerdo a lo previsto
                  por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares,el tratamiento de los datos
                  personales que usted nos transmite por este medio son bajo su autorización y conformidad acorde con las finalidades
                  previstas en nuestro aviso de privacidad,el cual puede consultar previamente en www.biis.mx. Asimismo, el resguardo
                  de dichos datos será bajo estrictas medidas de seguridad administrativas, técnicas y físicas las cuales han sido
                  implementadas con el objeto de proteger sus datos personales contra daño, pérdida, alteración, destrucción o
                  el uso, acceso o tratamiento no autorizados.</div>
          </div>
      </body>
    </html>`);
        popupWindow.document.close();
    }



}
