import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NameListService } from './name-list/name-list.service';
import { AuthService } from './auth/auth.service';
import { AutosizeDirective } from './directives/autosize.directive';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from '../material/material.module';
import { EmpresaService } from '../services/empresa.service';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, CustomMaterialModule],
  declarations: [ToolbarComponent, NavbarComponent, AutosizeDirective],
  exports: [ToolbarComponent, NavbarComponent,
    CommonModule, FormsModule, RouterModule, TranslateModule, CustomMaterialModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService, AuthService, EmpresaService]
    };
  }
}
