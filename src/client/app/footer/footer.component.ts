import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FOOTER_CONSTANTS } from './constants/footer.constants';

@Component({
  moduleId: module.id,
  selector: 'mgit-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css'],
})

export class FooterComponent implements OnInit {
    private messages: any;

    ngOnInit() {
        this.messages = Object.keys(FOOTER_CONSTANTS);
    }

    constructor(private translateService: TranslateService) {
        this.messages = {};
    }
}
