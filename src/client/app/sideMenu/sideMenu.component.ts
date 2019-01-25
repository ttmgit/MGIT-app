import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationStart } from '@angular/router';
import { SIDE_MENU_CONSTANTS } from './constants/sideMenu.constants';
import { UserService } from '../user/user.service';
import * as _ from 'lodash';
import { from } from 'rxjs/observable/from';
import { Usuario } from '../shared/types/usuario';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../shared/auth/auth.service';
import { ROLES } from '../shared/constants/roles.constants';
import { EmpresaService } from '../services/empresa.service';

@Component({
    moduleId: module.id,
    selector: 'opm-side-menu',
    templateUrl: 'sideMenu.component.html',
    styleUrls: ['sideMenu.component.css'],
})

export class SideMenuComponent implements OnInit {

    public menuItems: any[];
    public loginObservable: Observable<Usuario>;
    public logoutObservable: Observable<boolean>;
    private messages: any;
    private userInfo: Usuario;

    ngOnInit() {
        this.getUserInfo();
        this.messages = Object.keys(SIDE_MENU_CONSTANTS);
        this.listenToLoginObservable();
        this.listenToLogoutObservable();
    }

    constructor(private translateService: TranslateService,
        private authService: AuthService,
        private router: Router,
        private userService: UserService,
        private empresaService: EmpresaService) {
        this.messages = {};
        this.menuItems = [{ moduleIcon: 'fa fa-home', translateConstant: 'MAIN_SECTION', menus: [], url: 'welcome' }];
    }

    /**
     * @description - Observable listening for an user login
     */
    public listenToLoginObservable() {
        this.loginObservable = this.authService.getLoggedInSubject()
            .subscribe((userData: Usuario) => {
                if (userData !== null) {
                    this.getUserInfo();
                }
            });
    }

    /**
    * @description - Observable listening for an user logout
    */
    public listenToLogoutObservable() {
        this.logoutObservable = this.authService.getLogoutSubject().subscribe((result: boolean) => {
            this.menuItems = [{ moduleIcon: 'fa fa-home', translateConstant: 'MAIN_SECTION', menus: [], url: 'welcome' }];
        });
    }
    /**
     * @description Gets the user information
     */
    private getUserInfo(): void {
        this.userInfo = this.userService.getLocalUserData();
        if (this.userInfo) {
            this.setUserMenu();
        }
    }

    /**
     * @description Sets the user's menu according to the user´s role
     */
    private setUserMenu(): void {
        this.menuItems = [];
        if(this.userInfo.idRol == ROLES.ADMIN) {
            this.menuItems = [{ 
                    moduleIcon: 'fa fa-sitemap', 
                    descripcion: 'Visualizar empresas', 
                    url: 'visualizar-empresas'
                }, {
                    moduleIcon: 'fa fa-id-card', 
                    descripcion: 'Formularios', 
                    url: 'visualizar-formularios'
                }, {
                    moduleIcon: 'fa-plus', 
                    descripcion: 'Crear formulario', 
                    url: 'gestionar-formularios'
                }];
        } else if (this.userInfo.idRol == ROLES.EMPRESA) {
            this.empresaService.obtenerMenus().subscribe((menus: any[]) => {
                if(!_.isEmpty(menus)) {
                    menus.forEach((itemMenu) => {
                        this.menuItems.push({
                            moduleIcon: 'fa fa-file-text', 
                            descripcion: itemMenu.nombre_formulario, 
                            url: 'reporte/' + itemMenu.id
                        });
                    });
                    this.router.navigate(['reporte', _.first(menus).id]);
                }
            }, (error) => {
                console.log(error);
            });
        }
    }

}
