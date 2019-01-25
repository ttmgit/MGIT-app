import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderTable } from './order-table';
import { Order } from '../../shared/types/order';
import { Product } from '../../shared/types/product';
import { MESSAGE_CONSTANTS } from '../../constants/constants';
import { ORDERS_CONSTANTS } from './constants/orders.constants';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import * as moment from 'moment';


const NEXT_DAY: number = 1;
const PAGE_SIZE: number = 5;
const FIRST_ROW: number = 1;
const FIRST_PAGE: number = 1;


@Component({
  moduleId: module.id,
  selector: 'sd-orders',
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.css'],
})

export class OrdersComponent implements OnInit {


  public orders: Order[];
  public columns: ITdDataTableColumn[];
  public isPerformingAnAction: boolean;
  public filteredData: any[];
  public filteredTotal: number;
  public searchTerm: string;
  public fromRow: number;
  public currentPage: number;
  public pageSize: number;
  public sortBy: string;
  public selectedRows: any[];
  public sortOrder: TdDataTableSortingOrder;
  public messages: any;

  constructor(
    private _dataTableService: TdDataTableService,
    private dialog: MdDialog,
    private orderService: OrderService,
    private translateService: TranslateService,
    public toastr: ToastsManager) {
    this.orders = [];
    this.columns = [
      { name: 'id', label: 'Solicitud' },
      { name: 'orderDate', label: 'Fecha y hora' },
      { name: 'optimalDeliveryDate', label: 'Fecha Cita' },
      { name: 'account', label: 'Determinante', nested: true },
      { name: 'accountName', label: 'Tienda', nested: true },
      { name: 'product', label: 'Total de cajas', nested: true },
      { name: 'requestPerson', label: 'Solicitante', nested: true }
    ];
    this.messages = [];
  }

  public ngOnInit() {
    this.getOrders();
    let message_keys: Array<any>;
    message_keys = _.union(Object.keys(MESSAGE_CONSTANTS), Object.keys(ORDERS_CONSTANTS));
    for (let key of message_keys) {
      this.translateService.get(key).subscribe((messageContent: string) => {
        this.messages[key] = messageContent;
      });
    }
  }

  /**
   * @description Get orders
   */
  public getOrders(): void {
    this.orderService.getOrders().subscribe((foundOrders: Order[]) => {
      this.orders = foundOrders;
      this.searchTerm = '';
      this.fromRow = FIRST_ROW;
      this.currentPage = FIRST_PAGE;
      this.pageSize = PAGE_SIZE;
      this.sortBy = 'id';
      this.selectedRows = [];
      this.sortOrder = TdDataTableSortingOrder.Descending;
      this.filteredData = this.orders;
      this.filteredTotal = this.orders.length;
      this.filter(false);
    }, (error) => {
      this.toastr.error(this.messages[ORDERS_CONSTANTS.ERROR_TO_GET_ORDERS as any],
        this.messages[MESSAGE_CONSTANTS.APP_ERROR_TITLE as any]);
    });
  }

  /**
   * @description - Sorts the content by the column order given
   * @param {ITdDataTableSortChangeEvent} sortEvent - sort event triggered
   */
  public sort(sortEvent: ITdDataTableSortChangeEvent): void {
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter(false);
  }

  /**
   * @description - Searches for the registers which match with the search input
   * @param {string} searchTerm - word to search
   */
  public search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter(true);
  }

  /**
   * @description - Paginates the data by the page event content
   * @param {IPageChangeEvent} pagingEvent - Paginaton event
   */
  public page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter(false);
  }

  /**
   * @description - Filters the data by the search box input
   */
  public filter(searchAll: boolean): void {
    let newData: Order[] = this.orders;
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this.searchFor(this.searchTerm);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    if (!searchAll) {
      newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    }
    this.filteredData = newData;
  }

  /**
   * @description - Gets the total cases for the order given
   * @param {Order} rowOrder - order to get its total
   */
  public getTotalCases(rowOrder: Order): number {
    let totalCases: number = 0;
    rowOrder.product.forEach((product: Product) => {
      totalCases += product._pivot_quantity;
    });
    return totalCases;
  }

  /**
   * @description - filters the orders array for the term given
   * @param {string} term  -  term to search for
   */
  public searchFor(term: string): Order[] {
    let newData: Order[] = [];
    if (term !== '') {
      for (let column of this.columns) {
        if (column.name === 'accountName') {
          this.filteredData.forEach((order: Order) => {
            if (order.account[0].name.toLowerCase().includes(term.toLowerCase())) {
              newData.push(order);
            }
          });
        }
        if (column.name === 'account') {
          this.filteredData.forEach((order: Order) => {
            if (order.account[0].accountCode.toLowerCase().includes(term.toLowerCase())) {
              newData.push(order);
            }
          });
        }
        if (column.name === 'orderDate') {
          this.filteredData.forEach((order: Order) => {
            if (moment(order.orderDate).format('dd/mm/yyyy hh:mm:ss').includes(term)) {
              newData.push(order);
            }
          });
        }
        if (column.name === 'optimalDeliveryDate') {
          this.filteredData.forEach((order: Order) => {
            if (moment(order.optimalDeliveryDate).format('dd/mm/yyyy').includes(term)) {
              newData.push(order);
            }
          });
        }
        if (column.name === 'id') {
          this.filteredData.forEach((order: Order) => {
            if (order.id.toString().toLowerCase().includes(term.toLowerCase())) {
              newData.push(order);
            }
          });
        }
        if (column.name === 'requestPerson') {
          this.filteredData.forEach((order: Order) => {
            if (order.requestPerson.toLowerCase().includes(term.toLowerCase())) {
              newData.push(order);
            }
          });
        }
        if (column.name === 'product') {
          this.filteredData.forEach((order: Order) => {
            if (this.getTotalCases(order).toString().toLowerCase().includes(term.toLowerCase())) {
              newData.push(order);
            }
          });
        }
      }
    } else {
      newData = this.orders;
    }

    return _.uniqBy(newData, 'id');
  }

  /**
   * @description - Gets and show list of following
   * @param {number} idOrder- by follower or following
   */
  private openModal(idOrder: number) {
    let dialogReference = this.dialog.open(OrderDetailComponent, {
      data: Number(idOrder)
    });
  }
}
