import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GestionarFormulariosComponent } from './gestionar-formularios.component';
import { UserService } from '../../user/user.service';
import { AdministradorService } from '../../services/administrador.service';

@NgModule({
  imports: [ SharedModule],
  declarations: [GestionarFormulariosComponent],
  schemas: [],
  exports: [GestionarFormulariosComponent],
  providers: [UserService, AdministradorService]
})
export class GestionarFormulariosModule { }
