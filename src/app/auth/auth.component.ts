import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}
  isSignUpMode: boolean = false;
  //Signup
  signupForm = new FormGroup({
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    role: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ])
  });
  role: { value: string[]; viewValue: string }[] = [
    { value: ["user"], viewValue: 'Role_User' },
    { value: ["admin"], viewValue: 'Role_Admin' }
  ];
  //Login
  loginForm = new FormGroup({
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  //Variabili
  isLoading: boolean = false;
  error: string | null = null;

  switchAuthMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }

  getEmailErrorMessage() {
    if (this.isSignUpMode) {
      if (this.signupForm.hasError('required', 'email')) {
        return 'Il campo non può essere vuoto';
      }
      return this.signupForm.hasError('email', 'email')
        ? 'Email non valida'
        : '';
    } else {
      if (this.loginForm.hasError('required', 'email')) {
        return 'Il campo non può essere vuoto';
      }
      return this.loginForm.hasError('email', 'email')
        ? 'Email non valida'
        : '';
    }
  }
  getPasswordErrorMessage() {
    if (this.isSignUpMode) {
      if (this.signupForm.hasError('required', 'password')) {
        return 'Il campo non può essere vuoto';
      }
      return this.signupForm.hasError('minlength', 'password')
        ? 'La password deve essere di almeno 6 caratteri'
        : '';
    } else {
      if (this.loginForm.hasError('required', 'password')) {
        return 'Il campo non può essere vuoto';
      }
      return this.loginForm.hasError('minlength', 'password')
        ? 'La password deve essere di almeno 6 caratteri'
        : '';
    }
  }
  getPasswordConfirmErrorMessage() {
    if (this.signupForm.hasError('required', 'passwordConfirm')) {
      return 'Il campo non può essere vuoto';
    }
    this.signupForm.setErrors({errors:'notSame'})
      return this.signupForm.hasError('notSame','passwordConfirm')? 'Le due password non corrispondono':''
  }
  getUsernameErrorMessage() {
    if (this.isSignUpMode) {
      if (this.signupForm.hasError('required', 'username')) {
        return 'Il campo non può essere vuoto';
      }
      return this.signupForm.hasError('minlength', 'username')
        ? 'Il nome utente deve essere di almeno 3 caratteri'
        : '';
    }else{
      if (this.loginForm.hasError('required', 'username')) {
        return 'Il campo non può essere vuoto';
      }
      return this.loginForm.hasError('minlength', 'username')
        ? 'Il nome utente deve essere di almeno 3 caratteri'
        : '';
    }

  }
  getTypeErrorMessage() {
    return this.signupForm.hasError('required', 'type')
      ? 'Il campo non può essere vuoto'
      : '';
  }

  onSubmit() {
    this.error = null
    if (this.isSignUpMode) {
      if (this.signupForm.invalid) {
        return;
      }
      this.isLoading = true;
      this.auth.signup(this.signupForm.value).subscribe(
        (response) => {
          this.isLoading = false;
          this.isSignUpMode=false;
        },
        (error) => {
          this.error = error.error.message;
          this.isLoading = false;
        }
      );
    } else {
      if (this.loginForm.invalid) {
        return;
      }
      this.isLoading = true;

      this.auth.login(this.loginForm.value)
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.router.navigate(['/customer']);
        },
        (error) => {
          this.error = error.error.error;
          this.isLoading = false;
        }
      );
    }
  }

  ngOnInit(): void {}
}
