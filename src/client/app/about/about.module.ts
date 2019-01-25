import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about-routing.module';
import { CustomMaterialModule } from '../material/material.module';

@NgModule({
  imports: [CommonModule, AboutRoutingModule, CustomMaterialModule],
  declarations: [AboutComponent],
  exports: [AboutComponent]
})
export class AboutModule { }
