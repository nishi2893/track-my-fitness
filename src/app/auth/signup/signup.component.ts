import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  maxDate;
  isLoading$: Observable<boolean>;
  
  constructor(private authService: AuthService,
              private store: Store<fromRoot.State>) { }

  ngOnInit() {

    this.isLoading$ = this.store.select(fromRoot.getisLoading);
    this.maxDate=new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

  }

  onSubmit(form: NgForm){

    console.log(form);

    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });

  }

}
