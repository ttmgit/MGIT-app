import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from './sideMenu.component';
import { CustomMaterialModule } from '../material/material.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MdMenuModule } from '@angular/material';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CovalentExpansionPanelModule } from '@covalent/core';

export function HttpLoaderFactory(http: Http) {
    let prefix = '/assets/';
    return new TranslateHttpLoader(http, prefix);
   }


@NgModule({
    imports: [BrowserModule, CommonModule, RouterModule, CustomMaterialModule, CovalentExpansionPanelModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [Http]
        }
      })],
    declarations: [SideMenuComponent],
    exports: [SideMenuComponent]
})

export class SideMenuModule { }
