import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WelcomeRoutingModule } from './welcome.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { WelcomeComponent } from './welcome.component';


@NgModule({
    imports: [WelcomeRoutingModule, SharedModule],
    declarations: [WelcomeComponent],
    schemas: [],
    exports: [WelcomeComponent],
    providers: []
})
export class WelcomeModule { }
