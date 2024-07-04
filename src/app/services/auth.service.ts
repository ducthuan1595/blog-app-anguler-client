import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { URL_SERVER } from '../util/contant';
import { TokensType, UserType } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  URL = URL_SERVER;
  isUser = false;

  loggedUser: BehaviorSubject<UserType> =
    new BehaviorSubject<UserType>(null);
  logoutUser: EventEmitter<void> = new EventEmitter<void>();

  loggedTokens: BehaviorSubject<TokensType> =
    new BehaviorSubject<TokensType>(null);

  constructor(private http: HttpClient, private router: Router) {
    const tokens = JSON.parse(localStorage.getItem('token_blog'));
    const userData = JSON.parse(localStorage.getItem('account_blog'));
    if (userData && tokens) {
      this.loggedUser.next(userData);
      this.loggedTokens.next(tokens);
    }
  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        
        if(this.loggedUser) {
          if(!this.loggedUser || !this.loggedUser.value) {
            resolve(false)
          }          
          const isAuth = !!this.loggedUser.value.roleId.moderator;
          resolve(isAuth);
        }
        resolve(false)
      }, 800);
    });
    return promise;
  }

  signup(email: string, password: string, username: string) {
    return this.http.post<{ message: string }>(`${this.URL}/v1/api/auth/signup`, {
      email,
      password,
      username,
    });
  }

  login(email: string, password: string) {
    this.http
      .post<{ message: string; data: UserType; tokens: TokensType }>(
        `${this.URL}/v1/api/auth/login`,
        {
          email,
          password,
        }
      )
      .subscribe((res) => {
        
        if (res.message === 'ok') {
          localStorage.setItem('token_blog', JSON.stringify(res.tokens));
          localStorage.setItem('account_blog', JSON.stringify(res.data));
          this.loggedUser.next(res.data);
          this.loggedTokens.next(res.tokens);
          this.router.navigate(['']);
          this.isUser = true;
        }
      });
  }

  logout() {
    this.http.delete<{ message: string }>(`${this.URL}/v1/api/auth/logout`).subscribe(res => {
      if(res.message === 'ok') {
        localStorage.removeItem('account_blog');
        localStorage.removeItem('token_blog');
        
        this.router.navigate(['']);
        this.isUser = false;
        this.loggedUser.next(null);
      }
    })
  }

  getLoggedUser(): Observable<UserType> {
    return this.loggedUser.asObservable();
  }

  getLoggedToken(): Observable<TokensType> {
    return this.loggedTokens.asObservable();
  }
}
