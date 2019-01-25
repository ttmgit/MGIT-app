import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from '../user/login/login.component';
import { RegistroComponent } from '../user/registro/registro.component';
import { CuentaComponent } from '../user/cuenta/cuenta.component';
import { FormularioComponent } from '../components/formulario/formulario.component';
import { ReporteComponent } from '../components/reporte/reporte.component';
import { GestionarFormulariosComponent } from '../components/gestionar-formularios/gestionar-formularios.component';
import { VisualizarEmpresasComponent } from '../components/visualizar-empresas/visualizar-empresas.component';
import { VisualizarFormulariosComponent } from '../components/visualizar-formularios/visualizar-formularios.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent},
      { path: 'registro', component: RegistroComponent},
      { path: 'cuenta', component: CuentaComponent},
      { path: 'formulario/:id', component: FormularioComponent},
      { path: 'reporte' , component: ReporteComponent},
      { path: 'reporte/:id' , component: ReporteComponent},
      { path: 'gestionar-formularios', component: GestionarFormulariosComponent},
      { path: 'visualizar-empresas', component: VisualizarEmpresasComponent},
      { path: 'visualizar-formularios', component: VisualizarFormulariosComponent}
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
