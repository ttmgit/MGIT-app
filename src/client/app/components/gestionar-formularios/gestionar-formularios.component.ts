import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, Validator, ValidatorFn, FormControl } from '@angular/forms';
import { GENERAL } from '../../shared/constants/general.constants';
import * as _ from 'lodash';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AdministradorService } from '../../services/administrador.service';
import { Router } from '@angular/router';

const FINAL = 'FIN';
const INICIAL = 'E';
const VACIO = 'L';

@Component({
    moduleId: module.id,
    selector: 'mgit-gestionar-formularios',
    templateUrl: 'gestionar-formularios.component.html',
    styleUrls: ['gestionar-formularios.component.css'],
})
export class GestionarFormulariosComponent {

    public formularioForm: FormGroup;
    public preguntasForm: FormGroup;
    public indicadoresForm: FormGroup;
    public finalForm: FormGroup;
    public preguntasArreglo: any[];
    public indicadoresArreglo: any[];
    public aliasNoEncontrados: string;
    public validadorCustom: OperacionValidator;
    public formularioParaEnviar: any;
    public mostrarFormularioForm: boolean;
    public mostrarPreguntasForm: boolean;
    public mostrarIndicadoresForm: boolean;
    public mostrarFinalForm: boolean;

    constructor(
        private administradorService: AdministradorService,
        private formBuilder: FormBuilder,
        private toastr: ToastsManager,
        private router: Router,
    ) {
        this.aliasNoEncontrados = '';
        this.preguntasArreglo = [];
        this.indicadoresArreglo = []; 
        this.mostrarFormularioForm = true;
        this.mostrarPreguntasForm = false;
        this.mostrarIndicadoresForm = false;
        this.mostrarFinalForm = false;
        this.initializeLoginForm();
    }

    public initializeLoginForm(): void {
        this.formularioForm = this.formBuilder.group({
            nombreFormulario: ['', Validators.compose([Validators.required])]
        });
        this.preguntasForm = this.formBuilder.group({
            alias: ['', Validators.compose([Validators.required])],
            pregunta: ['', Validators.compose([Validators.required])],
            tipo: ['', Validators.compose([Validators.required])],
            l1: [''],
            l2: [''],
            l3: [''],
            l4: [''],
            l5: ['']
        });
        this.indicadoresForm = this.formBuilder.group({
            alias: ['', Validators.compose([Validators.required])],
            nombre: ['', Validators.compose([Validators.required])],
            operacion: ['', Validators.compose([Validators.required])],
            referencia: ['', Validators.compose([Validators.required])],
            comparativa: ['', Validators.compose([Validators.required])]
        });
        this.finalForm = this.formBuilder.group({
            aplicaTodasEmpresas: ['']
        });
    }

    public crearNombreFormulario(): void {
        this.mostrarFormularioForm = false;
        this.mostrarPreguntasForm = true;
        this.mostrarIndicadoresForm = false;
        this.mostrarFinalForm = false;
    }

    public regresarAFormulario(): void {
        this.mostrarFormularioForm = true;
        this.mostrarPreguntasForm = false;
        this.mostrarIndicadoresForm = false;
        this.mostrarFinalForm = false;
    }

    public agregarPregunta(): void {
        if (_.find(this.preguntasArreglo, { alias: this.preguntasForm.value.alias })) {
            this.toastr.error('Ya existe una pregunta con ese alias.', GENERAL.APP_ERROR_TITLE);
        } else {
            this.preguntasArreglo.push(this.preguntasForm.value);
        }
    }

    public eliminarPregunta(alias: string): void {
        if (!_.isEmpty(this.indicadoresArreglo) && _.find(this.preguntasArreglo, { alias: alias })) {
            if(confirm("¿Desea borrar la pregunta? Se borraran todos los indicadores")){
                this.indicadoresArreglo = [];
                _.remove(this.preguntasArreglo, { alias: alias });
            }
        } else {
            _.remove(this.preguntasArreglo, { alias: alias });
        }
    }

    public finalizarPreguntas(): void {
        this.mostrarFormularioForm = false;
        this.mostrarPreguntasForm = false;
        this.mostrarIndicadoresForm = true;
        this.mostrarFinalForm = false;
        this.validadorCustom = new OperacionValidator(this.preguntasArreglo);
        this.indicadoresForm = this.formBuilder.group({
            alias: ['', Validators.compose([Validators.required])],
            nombre: ['', Validators.compose([Validators.required])],
            operacion: ['', Validators.compose([Validators.required, this.validadorCustom.validator])],
            referencia: ['', Validators.compose([Validators.required])],
            comparativa: ['', Validators.compose([Validators.required])]
        });
    }

    public regresarAPreguntas(): void {
        this.mostrarFormularioForm = false;
        this.mostrarPreguntasForm = true;
        this.mostrarIndicadoresForm = false;
        this.mostrarFinalForm = false;
    }

    public agregarIndicador(): void {
        if (_.find(this.indicadoresArreglo, { alias: this.indicadoresForm.value.alias })) {
            this.toastr.error('Ya existe un indicador con ese alias.', GENERAL.APP_ERROR_TITLE);
        } else {
            this.indicadoresArreglo.push(this.indicadoresForm.value);
        }
    }

    public eliminarIndicador(alias: string): void {
        _.remove(this.indicadoresArreglo, { alias: alias });
    }

    public finalizarIndicadores(): void {
        this.mostrarFormularioForm = false;
        this.mostrarPreguntasForm = false;
        this.mostrarIndicadoresForm = false;
        this.mostrarFinalForm = true;
    }

    public regresarAIndicadores(): void {
        this.mostrarFormularioForm = false;
        this.mostrarPreguntasForm = false;
        this.mostrarIndicadoresForm = true;
        this.mostrarFinalForm = false;
    }

    public finalizar(): void {
        this.formularioParaEnviar = {
            formulario: this.formularioForm.value,
            preguntas: this.preguntasArreglo,
            indicadores: this.indicadoresArreglo,
            aplicaTodasEmpresas: this.finalForm.value.aplicaTodasEmpresas
        };
        console.log('finalizar');
        this.administradorService.crearFormulario(this.formularioParaEnviar).subscribe((respuesta: any) =>{
            console.log(respuesta);
            this.toastr.success('Formulario creado correctamente.', GENERAL.APP_SUCCESS_TITLE);
            this.router.navigate(['/visualizar-formularios']);
        }, (error) => {
            console.log(error);
            this.toastr.error('Ocurrió un error al crear el formulario.', GENERAL.APP_ERROR_TITLE);
        });
    }



}


export class OperacionValidator implements Validator {
    public validator: ValidatorFn;
    public tablaLL1: any;
    public simbolosNoTerminales: string[];
    public tokens: any[];
    public preguntasArreglo: any[];
    constructor(preguntas: any[]) {
        this.preguntasArreglo = preguntas;
        this.simbolosNoTerminales = ['E', 'F', 'G', 'H', 'I'];
        this.tokens = [{
            expresionRegular: /^[A-Za-z][A-Za-z0-9]{0,10}/,
            token: 'VAR'
        }, {
            expresionRegular: /^[0-9]+/,
            token: 'NUM'
        }, {
            expresionRegular: /^\+/,
            token: 'SUM'
        }, {
            expresionRegular: /^\-/,
            token: 'RES'
        }, {
            expresionRegular: /^\//,
            token: 'DIV'
        }, {
            expresionRegular: /^\*/,
            token: 'MUL'
        }, {
            expresionRegular: /^\(/,
            token: 'PAI'
        }, {
            expresionRegular: /^\)/,
            token: 'PAD'
        }];
        this.tablaLL1 = {
            VAR: {
                E: ['F', 'G'],
                F: null,
                G: ['H', 'I'],
                H: null,
                I: ['VAR']
            },
            NUM: {
                E: ['F', 'G'],
                F: null,
                G: ['H', 'I'],
                H: null,
                I: ['NUM']
            },
            SUM: {
                E: null,
                F: ['F', 'G', 'SUM'],
                G: null,
                H: [VACIO],
                I: null
            },
            RES: {
                E: null,
                F: ['F', 'G', 'RES'],
                G: null,
                H: [VACIO],
                I: null
            },
            DIV: {
                E: null,
                F: null,
                G: null,
                H: ['H', 'I', 'DIV'],
                I: null
            },
            MUL: {
                E: null,
                F: null,
                G: null,
                H: ['H', 'I', 'MUL'],
                I: null
            },
            PAI: {
                E: ['F', 'G'],
                F: null,
                G: ['H', 'I'],
                H: null,
                I: ['PAD', 'E', 'PAI']
            },
            PAD: {
                E: null,
                F: [VACIO],
                G: null,
                H: [VACIO],
                I: null
            },
            FIN: {
                E: null,
                F: [VACIO],
                G: null,
                H: [VACIO],
                I: null
            }
        };
        this.validator = this.validadorOperador();
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

    validadorOperador(): ValidatorFn {
        return (control: AbstractControl) => {
            if (control.value) {
                if (this.validarExpresion(control.value)) {
                    return null;
                }
                return { formulaIncorrecta: true };
            }
            return null;
        }
    }




    public validarExpresion(valorInput: string): boolean {
        let cadena: string;
        //Caso en el que dos variables estan juntas sin un signo intermedio
        if (valorInput.match(/[A-Za-z0-9]\s+[A-Za-z]/)) {
            return false;
        }
        //Limpia cadena y valida
        cadena = valorInput.replace(/\s/g, "");
        return this.analizarLL1(cadena);
    }

    /**
     * Analizador lexico
     */
    public getToken(cadena: string): any {
        let respuesta;
        let matchCadena;
        this.tokens.forEach((itemToken: any) => {
            matchCadena = cadena.match(itemToken.expresionRegular);
            if (matchCadena != null) {
                respuesta = {
                    token: itemToken.token,
                    subcadena: matchCadena[0],
                    cadenaRestante: cadena.substring(matchCadena[0].length, cadena.length)
                };
            }
        });
        return respuesta;
    }

    public pilaTokens(cadena: string): string[] {
        let cadenaRestante: string;
        let resultado: any;
        let respuesta: string[];
        cadenaRestante = cadena;
        respuesta = [];
        do {
            resultado = this.getToken(cadenaRestante);
            if (resultado != null) {
                cadenaRestante = resultado.cadenaRestante;
                respuesta.push(resultado.token);
                if(resultado.token == 'VAR') {
                    let pregunta = _.find(this.preguntasArreglo, {alias: resultado.subcadena});
                    if(pregunta == undefined ) {
                        //El alias no se encuentra
                        return null;
                    } else if( pregunta.tipo != 2 ) {
                        return null;
                    }
                }
            } else {
                //cadena invalida
                cadenaRestante = '';
                return null;
            }
        } while (cadenaRestante != '');
        respuesta.push(FINAL);
        return this.invertirArray(respuesta);
    }

    public invertirArray(cadena: string[]): string[] {
        var x = cadena.length - 1;
        var cadenaInvertida = [];
        while (x >= 0) {
            cadenaInvertida.push(cadena[x]);
            x--;
        }
        return cadenaInvertida;
    }

    /**
     * Analizador sintactico LL1
     */
    public analizarLL1(cadena: string): boolean {
        let pila: string[];
        let expAnalizar: string[];
        let peekPila: string;
        let peekExpAnalizar: string;
        pila = [];
        pila.push(FINAL);
        pila.push(INICIAL);
        expAnalizar = this.pilaTokens(cadena);
        while (!_.isEmpty(pila) && !_.isEmpty(expAnalizar)) {
            peekExpAnalizar = this.peek(expAnalizar)
            peekPila = this.peek(pila);
            if (this.esTerminal(peekPila)) {
                if (peekExpAnalizar == peekPila) {
                    pila.pop();
                    expAnalizar.pop();
                    if (_.isEmpty(pila)) {
                        //finalizo!!!!!! cadena correcta
                        return true;
                    }
                } else if (peekPila == VACIO) {
                    pila.pop();
                } else {
                    //error, es terminal pero no coincide
                    return false;
                }
            } else {
                pila.pop();
                if (this.tablaLL1[peekExpAnalizar][peekPila] != null) {
                    this.tablaLL1[peekExpAnalizar][peekPila].forEach((elementoTabla: string) => {
                        pila.push(elementoTabla);
                    });
                } else {
                    //cadena invalida
                    return false;
                }
            }
        }
        return false;
    }

    public peek(cadena: string[]): string {
        return cadena[cadena.length - 1];
    }

    public esTerminal(elemento: string): boolean {
        let respuesta = true;
        this.simbolosNoTerminales.forEach((itemArreglo: string) => {
            if (itemArreglo == elemento) {
                respuesta = false;
            }
        });
        return respuesta;
    }
}