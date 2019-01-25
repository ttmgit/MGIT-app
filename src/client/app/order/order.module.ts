import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OrdersComponent } from './orders/orders.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderService } from './order.service';
import { AccountService } from './account.service';
import { ProductService } from './product.service';
import { BrowserModule } from '@angular/platform-browser';
import { CovalentDataTableModule, CovalentSearchModule, CovalentPagingModule } from '@covalent/core';
import { CustomMaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { SharedModule } from '../shared/shared.module';
import { ConfirmOrderDialogComponent } from './confirm.order.dialog/confirm.order.dialog.component';
import { PrintOrderService } from './order-detail/print-order.service';

@NgModule({
  imports: [OrderRoutingModule, ReactiveFormsModule, BrowserModule, CovalentDataTableModule,
    CovalentSearchModule, CovalentPagingModule, CustomMaterialModule, FormsModule, CalendarModule, SharedModule,
  ],
  declarations: [OrdersComponent, CreateOrderComponent, OrderDetailComponent, ConfirmOrderDialogComponent],
  exports: [OrdersComponent, CreateOrderComponent, OrderDetailComponent, ConfirmOrderDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [OrderService, AccountService, ProductService, PrintOrderService],
  entryComponents: [OrderDetailComponent, ConfirmOrderDialogComponent]
})
export class OrderModule { }
