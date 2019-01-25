import { Component, OnInit, Inject } from '@angular/core';
import { OrderService } from '../order.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { ProductDocument } from '../product.document';
import { Order } from '../../shared/types/order';
import { from } from 'rxjs/observable/from';
import { forEach } from '@angular/router/src/utils/collection';
import { filter } from 'rxjs/operator/filter';
import { concat } from 'rxjs/operator/concat';
import { PrintOrderService } from './print-order.service';
import { MESSAGE_CONSTANTS } from '../../constants/constants';
import { ORDER_DETAIL_CONSTANTS } from './constants/order-detail.constants';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  moduleId: module.id,
  selector: 'sd-order-detail',
  templateUrl: 'order-detail.component.html',
  styleUrls: ['order-detail.component.css'],
})

export class OrderDetailComponent implements OnInit {

  public columns: ITdDataTableColumn[];
  public tableData: ProductDocument[];


  public filteredData: ProductDocument[];
  public filteredTotal: number;
  public searchTerm: string;
  public fromRow: number;
  public currentPage: number;
  public pageSize: number;
  public sortBy: string;
  public selectedOrder: Order;
  public selectedRows: any[];
  public sortOrder: TdDataTableSortingOrder;
  public messages: any;

  constructor( @Inject(MD_DIALOG_DATA) public data: any,
    private printOrderService: PrintOrderService,
    private orderService: OrderService,
    public dialogRef: MdDialogRef<OrderDetailComponent>,
    private _dataTableService: TdDataTableService,
    private translateService: TranslateService,
    public toastr: ToastsManager) {
    this.tableData = [];
    this.filteredData = this.tableData;
    this.filteredTotal = this.tableData.length;
    this.searchTerm = '';
    this.fromRow = 1;
    this.currentPage = 1;
    this.pageSize = 50;
    this.sortBy = 'sku';
    this.selectedRows = [];
    this.sortOrder = TdDataTableSortingOrder.Ascending;
    this.columns = [
      { name: 'sku', label: 'Clave Producto', sortable: true },
      { name: 'short_description', label: 'Descripciòn', filter: true, sortable: true },
      { name: 'case', label: 'Cajas', sortable: true },
      { name: 'items_by_case', label: 'Piezas', sortable: true },
      { name: 'origin', label: 'Origen', sortable: true },
      { name: 'account', label: 'Tienda', sortable: true },
      { name: 'type_shipment', label: 'Tipo de Carga', sortable: true },
      { name: 'sap_code', label: 'Folio de Embarque', sortable: true }
    ];
    this.messages = [];
  }

  ngOnInit(): void {
    this.getOrder();
    let message_keys: Array<any>;
    message_keys = _.union(Object.keys(MESSAGE_CONSTANTS), Object.keys(ORDER_DETAIL_CONSTANTS));
    for (let key of message_keys) {
      this.translateService.get(key).subscribe((messageContent: string) => {
        this.messages[key] = messageContent;
      });
    }
  }

  /**
   * @description Sorts the rows
   * @param {ITdDataTableSortChangeEvent} - sortEvent
   */
  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  /**
   * @description Search in all columns
   * @param {string} - searchTerm
   */
  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  /**
   * @description Handles pagination
   * @param {IPageChangeEvent} pagingEvent 
   */
  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  /**
   * @description Handles all events in the datatable
   */
  filter(): void {
    let newData: any[] = this.tableData;
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public print(): void {
    this.printOrderService.setOrder(this.selectedOrder);
    this.printOrderService.print();
  }

  private getOrder(): void {
    this.orderService.getOrders().subscribe(
      (ordersData) => {
        for (let order of ordersData) {
          if (order.id === this.data) {
            this.selectedOrder = order;
            break;
          }
        }
        this.setTableData();
      }, (error) => {
        this.toastr.error(this.messages[ORDER_DETAIL_CONSTANTS.ERROR_TO_GET_ORDER as any],
          this.messages[MESSAGE_CONSTANTS.APP_ERROR_TITLE as any]);
      }
    );
  }

  private setTableData(): void {
    let tableProduct: any;
    let accountName;
    accountName = '';
    for (let account of this.selectedOrder.account) {
      accountName = accountName + ' ' + account.name;
    }

    for (let product of this.selectedOrder.product) {
      tableProduct = {
        sku: product.sku,
        short_description: product.shortDescription,
        case: product._pivot_quantity,
        items_by_case: product.itemsByCase,
        origin: product.supplier,
        account: accountName,
        type_shipment: product.productHandling,
        sap_code: 0
      };
      this.tableData.push(tableProduct);
    }
    this.filter();
  }
}
