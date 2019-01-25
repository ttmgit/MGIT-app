import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';


// const ROLE_ADMIN: number = 1;

@Injectable()
export class AuthAdminGuard implements CanActivate {
    /*
    * Add to constructor
    private _router: Router,
    private userService: UserService
    */
    canActivate(): Observable<boolean> {
        return this.isAllowedAccess();
    }

    private isAllowedAccess() {
        /* let loggedInUser: UserInfo = this.userService.getLocalUserInfo();
         if (!loggedInUser || loggedInUser.role.id !== ROLE_ADMIN) {
             this._router.navigate(['']);
             return Observable.of(false);
         } else {
             return Observable.of(true);
         }*/
        return Observable.of(true);
    }
}
