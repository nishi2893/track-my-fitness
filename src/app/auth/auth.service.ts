import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService{

    constructor(private router: Router,
                private fireAuth: AngularFireAuth,
                private trainingService: TrainingService,
                private uiService: UIService,
                private store: Store<fromRoot.State>){}

    registerUser(authData: AuthData){

        this.store.dispatch(new UI.StartLoading());
        this.fireAuth.auth
        .createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log(result);
            this.store.dispatch(new UI.StopLoading());
        })
        .catch(error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(error.message, null, 3000);
            
        });
        
    }

    initAuthListener(){
 
      
        this.fireAuth.authState.subscribe(user => {
            if(user){

            this.store.dispatch(new Auth.SetAuthenticated());
            this.router.navigate(['/training']);

            } else{

              this.store.dispatch(new Auth.SetUnauthenticated());
               this.trainingService.cancelSubscriptions(); 
               this.router.navigate(['/login']);
            }
        });
    }

    login(authData: AuthData){

        this.store.dispatch(new UI.StartLoading());
        this.fireAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
           console.log(result);
           this.store.dispatch(new UI.StopLoading());
        })
        .catch(error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(error.message, null, 3000);
        }); 

    }

    logout(){
        this.fireAuth.auth.signOut();
    }

}