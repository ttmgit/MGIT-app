import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RegistroComponent } from './registro.component';
import { UserService } from '../user.service';


@NgModule({
  imports: [ SharedModule],
  declarations: [RegistroComponent],
  schemas: [],
  exports: [RegistroComponent],
  providers: [UserService]
})
export class RegistroModule { }
