import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReporteComponent } from './reporte.component';
import { UserService } from '../../user/user.service';


@NgModule({
  imports: [ SharedModule],
  declarations: [ReporteComponent],
  schemas: [],
  exports: [ReporteComponent],
  providers: [UserService]
})
export class ReporteModule { }
