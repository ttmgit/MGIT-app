import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { CreateOrderComponent } from './create-order/create-order.component';

import { AuthAdminGuard } from '../shared/guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'order/all', component: OrdersComponent, canActivate:[AuthAdminGuard]  },
      { path: 'order/create', component: CreateOrderComponent }
    ])
  ],
  exports: [RouterModule],
  providers:[AuthAdminGuard]
})
export class OrderRoutingModule { }
