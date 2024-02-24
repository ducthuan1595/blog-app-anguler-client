import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  isLogin = true;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    this.errorMessage = '';
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const username = form.value.username;

    if (this.isLogin) {
      this.authService.login(email, password);
      this.authService.transmitter().subscribe((res) => {
        this.errorMessage = res;
      })
      
    } else {
      this.authService.signup(email, password, username).subscribe(
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
