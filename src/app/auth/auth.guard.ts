import { CanActivate, 
         ActivatedRouteSnapshot, 
         RouterStateSnapshot, 
         CanLoad, 
         Route } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad{
  
    constructor(private store: Store<fromRoot.State>){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        return this.store.select(fromRoot.getisAuthenticated).pipe(take(1));

    }

    canLoad(route: Route) {
       
        return this.store.select(fromRoot.getisAuthenticated).pipe(take(1));
    }

}