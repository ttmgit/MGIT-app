import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormularioComponent } from './formulario.component';
import { UserService } from '../../user/user.service';


@NgModule({
  imports: [ SharedModule],
  declarations: [FormularioComponent],
  schemas: [],
  exports: [FormularioComponent],
  providers: [UserService]
})
export class FormularioModule { }
