import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cuenta } from '../../shared/types/cuenta';
import { GENERAL } from '../../shared/constants/general.constants';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ROLES } from '../../shared/constants/roles.constants';

@Component({
    moduleId: module.id,
    selector: 'mgit-cuenta',
    templateUrl: 'cuenta.component.html',
    styleUrls: ['cuenta.component.css'],
})

export class CuentaComponent {
    public cuentaForm: FormGroup;
    public showEmpresa: boolean;
    constructor(private formBuilder: FormBuilder,
        private userService: UserService,
        private toastr: ToastsManager,
        private router: Router
    ) {
        this.initializeLoginForm();
    }

    public initializeLoginForm(): void {
        let user = this.userService.getLocalUserData();
        this.showEmpresa = false;
        if(user){
            if(user.idRol == ROLES.ADMIN) {
                this.cuentaForm = this.formBuilder.group({
                    correo: ['', Validators.compose([Validators.required])],
                    password: ['', Validators.compose([Validators.required])],
                    passwordAnterior: ['', Validators.compose([Validators.required])]
                });
            } else if(user.idRol == ROLES.EMPRESA) {
                this.showEmpresa = true;
                this.cuentaForm = this.formBuilder.group({
                    correo: ['', Validators.compose([Validators.required])],
                    password: ['', Validators.compose([Validators.required])],
                    nombreEmpresa: ['', Validators.compose([Validators.required])],
                    nombreRepresentante: ['', Validators.compose([Validators.required])],
                    cargoRepresentante: ['', Validators.compose([Validators.required])],
                    sector: ['', Validators.compose([Validators.required])],
                    subSector: ['', Validators.compose([Validators.required])],
                    passwordAnterior: ['', Validators.compose([Validators.required])]
                });
            }
        } else {
            this.router.navigate(['login']);
        }
    }

    public actualizarInfo(): void {
        let registro: Cuenta;
        registro = {
            correo: this.cuentaForm.value.correo,
            password: this.cuentaForm.value.password,
            nombreEmpresa: this.cuentaForm.value.nombreEmpresa,
            nombreRepresentante: this.cuentaForm.value.nombreRepresentante,
            cargoRepresentante: this.cuentaForm.value.cargoRepresentante,
            sector: this.cuentaForm.value.sector,
            subSector: this.cuentaForm.value.subSector,
            passwordAnterior: this.cuentaForm.value.passwordAnterior
        };
        this.userService.putUsuario(registro).subscribe((response) => {
            this.toastr.success('Datos actualizados correctamente', GENERAL.APP_SUCCESS_TITLE);
            this.router.navigate(['login']);
        }, (error) => {
            this.toastr.error('Ocurrió un error al actualizar', GENERAL.APP_ERROR_TITLE);
        });
    }

}
