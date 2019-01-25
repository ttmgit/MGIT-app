import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { UserService } from '../user.service';


@NgModule({
  imports: [SharedModule],
  declarations: [LoginComponent],
  schemas: [],
  exports: [LoginComponent],
  providers: [UserService]
})
export class LoginModule { }
