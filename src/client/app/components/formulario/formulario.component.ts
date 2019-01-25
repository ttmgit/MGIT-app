import { Component } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'mgit-formulario',
    templateUrl: 'formulario.component.html',
    styleUrls: ['formulario.component.css'],
})

export class FormularioComponent {

    public idFormulario: number;
    public preguntas: any;
    public respuestas: any;
    constructor(
        private route: ActivatedRoute,
        private empresaService: EmpresaService
    ) {
       this.traerParametros();
       this.preguntas = [];
       this.respuestas = [];
    }

    public traerParametros(): void {
        this.route.params.subscribe((parametros) => {
            if(parametros['id']) {
                this.idFormulario = Number(parametros['id']);
                this.empresaService.obtenerFormulario(this.idFormulario).subscribe((respuesta) => {
                    this.preguntas = respuesta;
                    console.log(this.preguntas);
                }, (error) => {
                    console.log(error);
                });
            }
        });
    }

    public enviar(): void {
        this.empresaService.putFormulario(this.idFormulario, this.respuestas).subscribe((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }
}
