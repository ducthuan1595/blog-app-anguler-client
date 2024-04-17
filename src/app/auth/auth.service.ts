import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface UserResponseType {
  email: string;
  username: string;
  token?: string;
  _id: string;
  role: string;
}

export interface AuthResponseType {
  user: UserResponseType;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  URL = 'http://localhost:5000';
  user: AuthResponseType;
  isUser = false;

  loggedUser: BehaviorSubject<AuthResponseType> =
    new BehaviorSubject<AuthResponseType>(null);
  logoutUser: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient, private router: Router) {
    const userData = JSON.parse(localStorage.getItem('account_blog'));
    if (userData) {
      this.loggedUser.next(userData);
    }
  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        
        if(this.loggedUser) {
          if(!this.loggedUser || !this.loggedUser.value || this.loggedUser.value.user.role !== 'F2') {
            resolve(false)
          }
          const isAuth = !!this.loggedUser.value;
          resolve(isAuth);
        }
        resolve(false)
      }, 800);
    });
    return promise;
  }

  signup(email: string, password: string, username: string) {
    return this.http.post<{ message: string }>(`${this.URL}/v2/api/signup`, {
      email,
      password,
      username,
    });
  }

  login(email: string, password: string) {
    this.http
      .post<{ message: string; data: AuthResponseType }>(
        `${this.URL}/v2/api/login`,
        {
          email,
          password,
        }
      )
      .subscribe((res) => {
        
        if (res.message === 'ok') {
          localStorage.setItem('account_blog', JSON.stringify(res.data));
          this.loggedUser.next(res.data);
          this.router.navigate(['']);
          this.isUser = true;
        }
      });
  }

  loginAd(email: string, password: string) {
    this.http
      .post<{ message: string; data: AuthResponseType }>(
        `${this.URL}/v2/api/login-auth`,
        {
          email,
          password,
        }
      )
      .subscribe(
        (res) => {          
          this.loggedUser.next(res.data);
          this.router.navigate(['/system/dashboard']);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  logout() {
    localStorage.removeItem('account_blog');
    
    this.router.navigate(['']);
    this.isUser = false;
    this.loggedUser.next(null);
  }

  logoutAd() {
    // this.loggedUser = null;
    this.logoutUser.emit(null);
    this.router.navigate(['/system']);
  }

  getLoggedUser(): Observable<AuthResponseType> {
    return this.loggedUser.asObservable();
  }
}
