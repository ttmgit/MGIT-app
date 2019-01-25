import * as _ from 'lodash';
import * as moment from 'moment';
import { Account } from '../../shared/types/account';
import { AccountService } from '../account.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { IPageChangeEvent } from '@covalent/core';
import {
  ITdDataTableColumn,
  ITdDataTableSortChangeEvent,
  TdDataTableService,
  TdDataTableSortingOrder
} from '@covalent/core';
import { Order } from '../../shared/types/order';
import { OrderRequest } from '../../shared/types/order-request';
import { OrderService } from '../order.service';
import { Product } from '../../shared/types/product';
import { ProductService } from '../product.service';
import { Category } from '../../shared/types/category';
import { MdDialogRef, MdDialog } from '@angular/material';
import { ConfirmOrderDialogComponent } from '../confirm.order.dialog/confirm.order.dialog.component';
import { MESSAGE_CONSTANTS } from '../../constants/constants';
import { CREATE_ORDER_CONSTANTS } from './constants/create-order.constants';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TranslateService } from '@ngx-translate/core';

const NEXT_DAY: number = 1;
const PAGE_SIZE: number = 5;
const FIRST_ROW: number = 1;
const FIRST_PAGE: number = 1;

@Component({
  moduleId: module.id,
  selector: 'opm-create-order',
  templateUrl: 'create-order.component.html',
  styleUrls: ['create-order.component.css'],
})

export class CreateOrderComponent implements OnInit {

  public createOrderForm: FormGroup;
  public userAccounts: Account[];

  public products: Product[];
  public columns: ITdDataTableColumn[];
  public isPerformingAnAction: boolean;
  public filteredData: any[];
  public filteredTotal: number;
  public isCreatingCompany: boolean;
  public searchTerm: string;
  public fromRow: number;
  public currentPage: number;
  public pageSize: number;
  public sortBy: string;
  public selectedRows: any[];
  public sortOrder: TdDataTableSortingOrder;
  public totalCases: number;
  public totalItems: number;
  public minDate: Date;
  public messages: any;

  constructor(private productService: ProductService,
    public dialog: MdDialog,
    private orderService: OrderService,
    private _dataTableService: TdDataTableService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    public toastr: ToastsManager) {
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + NEXT_DAY);
    this.totalCases = 0;
    this.totalItems = 0;
    this.userAccounts = [];
    this.products = [];
    this.columns = [
      { name: 'id', label: 'id', hidden: true },
      { name: 'sku', label: 'Clave' },
      { name: 'largeDescription', label: 'Descripción del producto' },
      { name: 'itemsByCase', label: 'Piezas por Caja' },
      { name: 'quantity', label: 'Cajas a Solicitar', nested: true },
      { name: 'total', label: 'Total Piezas', nested: true }
    ];
    this.messages = [];
  }

  public ngOnInit() {
    this.getUserAccounts();
    this.initializeCreateOrderForm();
    let message_keys: Array<any>;
    message_keys = _.union(Object.keys(MESSAGE_CONSTANTS), Object.keys(CREATE_ORDER_CONSTANTS));
    for (let key of message_keys) {
      this.translateService.get(key).subscribe((messageContent: string) => {
        this.messages[key] = messageContent;
      });
    }
  }

  /**
   * @description - Initializes the form
  */
  public initializeCreateOrderForm() {
    this.createOrderForm = this.formBuilder.group({
      currentAccount: [''],
      optimalDeliveryDate: [this.minDate],
      requestPerson: ['', Validators.required],
    });

  }

  /**
   * @description - Gets the related product by the category from the current Account
   * @param {Category} category  - category to search products for
   */
  public getProductByCategory(category: Category): void {
    this.productService.getProducts(category.id)
      .subscribe((foundProducts: Product[]) => {
        this.products = foundProducts;
        _.forEach(this.products, (product: Product) => {
          product.total = 0;
        })
        this.searchTerm = '';
        this.fromRow = FIRST_ROW;
        this.currentPage = FIRST_PAGE;
        this.pageSize = PAGE_SIZE;
        this.sortBy = 'sku';
        this.selectedRows = [];
        this.sortOrder = TdDataTableSortingOrder.Descending;
        this.filteredData = this.products;
        this.filteredTotal = this.products.length;
        this.filter(false);
      }, (error) => {
        this.toastr.error(this.messages[CREATE_ORDER_CONSTANTS.ERROR_TO_GET_PRODUCTS as any],
          this.messages[MESSAGE_CONSTANTS.APP_ERROR_TITLE as any]);
      });
  }

  /**
   * @description - Event triggered after an account change
   * @param {any} event - form control input
   */
  public changeAccount(event: any) {
    let account: Account = event.value;
    this.getProductByCategory(account.category);
  }

  /** 
   * @description - Gets the user available accounts
  */
  public getUserAccounts() {
    this.accountService.getAccounts().subscribe((foundAccounts: Account[]) => {
      this.userAccounts = foundAccounts;
      if (!_.isEmpty(this.userAccounts)) {
        let firstAccount: Account = this.userAccounts[0];
        this.createOrderForm.patchValue({
          currentAccount: firstAccount
        });
        this.getProductByCategory(firstAccount.category);
      }
    }, (error) => {
      this.toastr.error(this.messages[CREATE_ORDER_CONSTANTS.ERROR_TO_GET_ACCOUNTS as any],
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
    let newData: Product[] = this.products;
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
    if (!searchAll) {
      newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    }
    this.filteredData = newData;
  }

  /**
   * @description - Updates the total value for the product given
   * @param {any} event - focused element
   * @param {Product} rowProduct - product to update total value
   */
  public updateValue(event: any, rowProduct: Product): void {
    let element: any = (<HTMLInputElement>event.target);
    this.filteredData.forEach((product: Product) => {
      if (product.id === rowProduct.id) {
        product.total = element.value * product.itemsByCase;
        this.totalCases = this.getTotalCases();
        this.totalItems = this.getTotalItems();
      }
    });
  }

  /**
   * @description - Gets the total cases for all the products the user is requesting
  */
  public getTotalCases(): number {
    let totalCases: number = 0;
    _.forEach(this.filteredData, (product: Product) => {
      let casesByProduct: number = product.total / product.itemsByCase;
      totalCases += casesByProduct;
    });
    return totalCases;
  }

  /** 
   * @description - Gets the total items for all the products the user is requesting
  */
  public getTotalItems(): number {
    let totalItems: number = 0;
    this.filteredData.forEach((product: Product) => {
      let total: number = isNaN(product.total) ? 0 : product.total;
      totalItems += total;
    });
    return totalItems;
  }

  /** 
   * @description - Calls the save order service
  */
  public saveOrder(): void {
    let requestPerson: string = this.createOrderForm.value.requestPerson;
    let currentAccount: Account = this.createOrderForm.value.currentAccount;
    let orderProductRequest: OrderRequest;
    let productsArray: Product[] = [];
    let order: Order = {
      name: 'Orden de ' + requestPerson,
      requestPerson: requestPerson,
      orderDate: moment().utc(true).toDate(),
      optimalDeliveryDate: this.createOrderForm.value.optimalDeliveryDate
    };
    this.filteredData.forEach((itemProduct: Product) => {
      if (itemProduct.total > 0) {
        productsArray.push({
          product_id: itemProduct.id,
          quantity: itemProduct.total / itemProduct.itemsByCase
        });
      }
    });
    orderProductRequest = {
      order: order,
      products: productsArray
    };
    this.openDialog(orderProductRequest, this.filteredData, currentAccount);
  }


  public openDialog(orderRequest: OrderRequest, products: Product[], currentAccount: Account): void {
    let dialogRef = this.dialog.open(ConfirmOrderDialogComponent, {
      width: '80%',
      data: { orderRequest: orderRequest, products: products }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.createOrder(orderRequest, currentAccount.id).subscribe((order: Order) => {
          this.toastr.success(this.messages[CREATE_ORDER_CONSTANTS.SUCCESS_TO_CREATE_ORDER as any],
            this.messages[MESSAGE_CONSTANTS.APP_SUCCESS_TITLE as any]);
        }, (error) => {
          this.toastr.error(this.messages[CREATE_ORDER_CONSTANTS.ERROR_TO_CREATE_ORDER as any],
            this.messages[MESSAGE_CONSTANTS.APP_ERROR_TITLE as any]);
        });
      }
    });
  }
}
