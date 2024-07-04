import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  isLogin = true;
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    const username = form.value.username;

    if (this.isLogin) {
      this.authService.login(email, password).pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe((res) => {
        
        if (res.message === 'ok') {
          localStorage.setItem('token_blog', JSON.stringify(res.tokens));
          localStorage.setItem('account_blog', JSON.stringify(res.data));
          this.authService.loggedUser.next(res.data);
          this.authService.loggedTokens.next(res.tokens);
          this.router.navigate(['']);
        }
      });;
    } else {
      this.authService.signup(email, password, username).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(
        (res) => {
          console.log(res);
          this.isLogin = true;
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Email already exist!';
        }
      );
    }

    form.reset();
  }
}
