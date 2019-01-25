import {
        MdButtonModule, MdRadioModule, MdCheckboxModule, MdInputModule, MdIconModule, MdMenuModule,
        MdProgressBarModule, MdProgressSpinnerModule, MdCardModule, MdSelectModule, MaterialModule, MdAutocompleteModule, MdOptionModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
        imports: [
                MdButtonModule, MdCheckboxModule, MdRadioModule, MdInputModule, MdIconModule, MdMenuModule,
                MdProgressBarModule, MdProgressSpinnerModule, MdCardModule, MdSelectModule, MaterialModule,
                MdAutocompleteModule, ReactiveFormsModule, FormsModule, MdOptionModule
        ],
        exports: [
                MdButtonModule, MdCheckboxModule, MdRadioModule, MdInputModule, MdIconModule, MdMenuModule,
                MdProgressBarModule, MdProgressSpinnerModule, MdCardModule, MdSelectModule, MaterialModule,
                MdAutocompleteModule, ReactiveFormsModule, FormsModule, MdOptionModule
        ],
})
export class CustomMaterialModule { }
