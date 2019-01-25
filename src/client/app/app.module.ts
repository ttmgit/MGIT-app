import { ToastOptions, ToastModule } from 'ng2-toastr/ng2-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { Http, HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainMenuModule } from './mainMenu/mainMenu.module';
import { SideMenuModule } from './sideMenu/sideMenu.module';
import { FooterModule } from './footer/footer.module';

import {
  MdInputModule, MdButtonModule, MdDialogModule, MdMenuModule,
  MdCardModule, MdChipsModule, MdCheckboxModule, MdIconModule,
} from '@angular/material';
import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';

import { SharedModule } from './shared/shared.module';
import { ToastrConfigClass } from './ng2toastr.config';
import { CustomMaterialModule } from './material/material.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RestangularModule } from 'ngx-restangular';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Config } from './shared/index';
import { AuthService } from './shared/auth/auth.service';
import { RestangularConfigFactory } from './shared/auth/auth.config';


// Covalent Framework
import {
  CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule, CovalentFileModule,
  CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
  CovalentNotificationsModule, CovalentMenuModule, CovalentChipsModule, CovalentDataTableModule, CovalentJsonFormatterModule,
  CovalentMessageModule
} from '@covalent/core';

// Translate Factory
export function HttpLoaderFactory(http: Http) {
  let prefix = '/assets/';
  return new TranslateHttpLoader(http, prefix);
}
import { from } from 'rxjs/observable/from';
import { WelcomeModule } from './shared/welcome.component/welcome.module';
import { OrderModule } from './order/order.module';

import { LoginModule } from './user/login/login.module';
import { LoginComponent } from './user/login/login.component';
import { RegistroModule } from './user/registro/registro.module';
import { RegistroComponent } from './user/registro/registro.component';
import { CuentaModule } from './user/cuenta/cuenta.module';
import { CuentaComponent } from './user/cuenta/cuenta.component';
import { FormularioModule } from './components/formulario/formulario.module';
import { FormularioComponent } from './components/formulario/formulario.component';
import { ReporteModule } from './components/reporte/reporte.module';
import { ReporteComponent } from './components/reporte/reporte.component';
import { GestionarFormulariosModule } from './components/gestionar-formularios/gestionar-formularios.module';
import { GestionarFormulariosComponent } from './components/gestionar-formularios/gestionar-formularios.component';
import { VisualizarEmpresasModule } from './components/visualizar-empresas/visualizar-empresas.module';
import { VisualizarEmpresasComponent } from './components/visualizar-empresas/visualizar-empresas.component';
import { VisualizarFormulariosModule } from './components/visualizar-formularios/visualizar-formularios.module';
import { VisualizarFormulariosComponent } from './components/visualizar-formularios/visualizar-formularios.component';
import { ServicesModule } from './services/services.module';


@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, HttpModule, AppRoutingModule, MainMenuModule, SideMenuModule, AboutModule, HomeModule,
    MdMenuModule, MdButtonModule, HttpModule, SharedModule.forRoot(), CustomMaterialModule, LoginModule, OrderModule,
    FooterModule, RegistroModule, CuentaModule, FormularioModule, ReporteModule, GestionarFormulariosModule, VisualizarEmpresasModule,
    VisualizarFormulariosModule, ServicesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    ToastModule.forRoot(),
    WelcomeModule,
    // Restangular
    RestangularModule.forRoot([AuthService], RestangularConfigFactory),
    // Covalent Framework
    CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule, CovalentFileModule,
    CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
    CovalentNotificationsModule, CovalentMenuModule, CovalentChipsModule, CovalentDataTableModule, CovalentJsonFormatterModule,
    CovalentMessageModule, CovalentPagingModule,

  ],
  entryComponents: [LoginComponent, RegistroComponent, CuentaComponent, FormularioComponent, ReporteComponent,
    GestionarFormulariosComponent, VisualizarEmpresasComponent, VisualizarFormulariosComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  declarations: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '<%= APP_BASE %>' },
    { provide: ToastOptions, useClass: ToastrConfigClass },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
