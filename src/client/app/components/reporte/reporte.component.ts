import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'mgit-reporte',
    templateUrl: 'reporte.component.html',
    styleUrls: ['reporte.component.css'],
})

export class ReporteComponent implements OnInit{

    public errorParametros: boolean;
    public reporte: any;
    private idFormulario: number;
    constructor(
        private route: ActivatedRoute,
        private empresaService: EmpresaService
    ) {
        this.reporte = [];
        this.traerParametros();
    }

    public ngOnInit() {
        if(this.idFormulario) {
            this.empresaService.obtenerReporte(this.idFormulario).subscribe((response) => {
                this.reporte = response;
                console.log(response);
            }, (error) => {
                console.log(error);
            });
        }
    }

    public traerParametros(): void{
        this.route.params.subscribe((parametros) => {
            if(parametros['id']) {
                this.idFormulario = Number(parametros['id']);
                this.errorParametros = false;
            } else {
                this.errorParametros = true;
            }
        });
    }
}
