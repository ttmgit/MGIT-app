import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Account } from '../../shared/types/account';
import { AccountService } from '../account.service';
import { Component, OnInit, Inject } from '@angular/core';
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


const NEXT_DAY: number = 1;
const PAGE_SIZE: number = 5;
const FIRST_ROW: number = 1;
const FIRST_PAGE: number = 1;

@Component({
    moduleId: module.id,
    selector: 'opm-confirm-order-dialof',
    templateUrl: 'confirm.order.dialog.component.html',
    styleUrls: ['confirm.order.dialog.component.css'],
})
export class ConfirmOrderDialogComponent {

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
    public orderDetail: Order;

    constructor(@Inject(MD_DIALOG_DATA) public data: any,
        public dialogRef: MdDialogRef<ConfirmOrderDialogComponent>,
        private _dataTableService: TdDataTableService) {
        this.products = [];
        this.orderDetail = data.orderRequest.order;
        for (let requestedProduct of data.orderRequest.products) {
            let productRequested: Product = _.find(data.products, (product: Product) => {
                return (product.id === requestedProduct.product_id);
            });
            if (productRequested) {
                productRequested.quantity = productRequested.total/ productRequested.itemsByCase;
                this.products.push(productRequested);
            }
        }

        this.columns = [
            { name: 'id', label: 'id', hidden: true },
            { name: 'sku', label: 'Clave' },
            { name: 'largeDescription', label: 'Descripción del producto' },
            { name: 'itemsByCase', label: 'Piezas por Caja', hidden: true },
            { name: 'quantity', label: 'Cajas' },
            { name: 'total', label: 'Total Piezas', hidden: true }
        ];
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

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close(true);
    }
};

