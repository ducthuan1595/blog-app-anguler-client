import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface AuthResponseType {
  email: string;
  username: string;
  token?: string;
  id: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthAdminComponent {
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router // private route: Route
  ) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const data = {
      email: form.value.email,
      password: form.value.password,
    };

    form.reset();
  }
}
