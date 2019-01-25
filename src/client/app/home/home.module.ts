import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';;
import { LoginModule } from '../user/login/login.module';
import { CalendarModule } from 'primeng/components/calendar/calendar';



@NgModule({
  imports: [HomeRoutingModule, SharedModule, LoginModule, CalendarModule],
  declarations: [HomeComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  exports: [HomeComponent],
  providers: []
})
export class HomeModule { }
