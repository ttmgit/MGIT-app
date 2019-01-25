import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VisualizarEmpresasComponent } from './visualizar-empresas.component';
import { UserService } from '../../user/user.service';


@NgModule({
  imports: [ SharedModule],
  declarations: [VisualizarEmpresasComponent],
  schemas: [],
  exports: [VisualizarEmpresasComponent],
  providers: [UserService]
})
export class VisualizarEmpresasModule { }
