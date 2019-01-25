import * as _ from 'lodash';
import { AuthService } from '../../shared/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GENERAL } from '../../shared/constants/general.constants';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TokenResponseInterface } from '../../shared/auth/token-response.interface';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../user.service';
import { Usuario } from '../../shared/types/usuario';
import { Router } from '@angular/router';
import { Cuenta } from '../../shared/types/cuenta';
import { EmpresaService } from '../../services/empresa.service';

@Component({
    moduleId: module.id,
    selector: 'mgit-registro',
    templateUrl: 'registro.component.html',
    styleUrls: ['registro.component.css'],
})

export class RegistroComponent implements OnInit {

    public registroForm: FormGroup;
    public messages: any[];


    constructor(private formBuilder: FormBuilder,
        private toastr: ToastsManager,
        private router: Router,
        private translateService: TranslateService,
        private authService: AuthService,
        private userService: UserService,
        private empresaService: EmpresaService
    ) {
        this.messages = [];
        this.initializeLoginForm();
    }

    public ngOnInit() {
        this.isLoggedIn();
    }


    /**
     * @description - Initializes loginForm
    */
    public initializeLoginForm(): void {
        this.registroForm = this.formBuilder.group({
            correo: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])],
            nombreEmpresa: ['', Validators.compose([Validators.required])],
            nombreRepresentante: ['', Validators.compose([Validators.required])],
            cargoRepresentante: ['', Validators.compose([Validators.required])],
            sector: ['', Validators.compose([Validators.required])],
            subSector: ['', Validators.compose([Validators.required])],
            terminos: ['', Validators.compose([Validators.required])]
        });
    }

    public registrar(): void {
        let registro: Cuenta;
        registro = {
            correo: this.registroForm.value.correo,
            password: this.registroForm.value.password,
            nombreEmpresa: this.registroForm.value.nombreEmpresa,
            nombreRepresentante: this.registroForm.value.nombreRepresentante,
            cargoRepresentante: this.registroForm.value.cargoRepresentante,
            sector: this.registroForm.value.sector,
            subSector: this.registroForm.value.subSector
        };
        this.empresaService.crearEmpresa(registro).subscribe((response) => {
            this.toastr.success('Registro correcto', GENERAL.APP_SUCCESS_TITLE);
            this.router.navigate(['login']);
        }, (error) => {
            this.toastr.error('Ocurrió un error al registrarse', GENERAL.APP_ERROR_TITLE);
        });
    }

    public isLoggedIn(): void {
        let user = this.userService.getLocalUserData();
        if(user){
            this.router.navigate(['login']);
        }
    }

}
