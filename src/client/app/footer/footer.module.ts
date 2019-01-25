import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer.component';
import { CustomMaterialModule } from '../material/material.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MdMenuModule } from '@angular/material';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: Http) {
    let prefix = '/assets/';
    return new TranslateHttpLoader(http, prefix);
   }


@NgModule({
    imports: [BrowserModule, CommonModule, RouterModule, CustomMaterialModule, TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [Http]
        }
      })],
    declarations: [FooterComponent],
    exports: [FooterComponent]
})

export class FooterModule { }
