import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VisualizarFormulariosComponent } from './visualizar-formularios.component';
import { UserService } from '../../user/user.service';


@NgModule({
  imports: [ SharedModule],
  declarations: [VisualizarFormulariosComponent],
  schemas: [],
  exports: [VisualizarFormulariosComponent],
  providers: [UserService]
})
export class VisualizarFormulariosModule { }
