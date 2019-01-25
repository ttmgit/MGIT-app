import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CuentaComponent } from './cuenta.component';
import { UserService } from '../user.service';


@NgModule({
  imports: [ SharedModule],
  declarations: [CuentaComponent],
  schemas: [],
  exports: [CuentaComponent],
  providers: [UserService]
})
export class CuentaModule { }
