import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { TokensType, UserType } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private user: UserType = null;
  private tokens: TokensType = null;
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    // const tokens = JSON.parse(localStorage.getItem('token_blog')) ?? null;
    // return next.handle(req);
    
    this.authService.getLoggedUser().subscribe((res) => {
      if (res) {        
        this.user = res;
      }
    });

    this.authService.getLoggedToken().subscribe((res) => {
      if (res) {                
        this.tokens = res;
      }
    });

    if(this.tokens && req.url.includes('/v1/api/auth/logout') && req.method === 'DELETE') {      
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.tokens.access_token} ${this.tokens.refresh_token}`),
      });
      return next.handle(authRequest);
    }

    if (
      this.user && this.user.roleId.user && this.tokens && (
        (req.url.includes('/v1/api/comment') && req.method === 'POST') ||
        (req.url.includes('/v1/api/blog') && req.method === 'POST') ||
        (req.url.includes('/v1/api/blog/user') && req.method === 'GET') ||
        (req.url.includes('/v1/api/blog') && req.method === 'PUT') ||
        (req.url.includes('/v1/api/blog') && req.method === 'DELETE') ||
        (req.url.includes('/v1/api/like') && req.method === 'GET') ||
        (req.url.includes('/v1/api/like') && req.method === 'POST') ||
        (req.url.includes('/v1/api/category') && req.method === 'PUT') ||
        (req.url.includes('/v1/api/category') && req.method === 'POST') ||
        (req.url.includes('/v1/api/notify/unread') && req.method === 'GET') ||
        (req.url.includes('/v1/api/notify/read') && req.method === 'GET')
      )
    ) {      
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.tokens.access_token}`),
      });
      return next.handle(authRequest);
    }

    return next.handle(req);
  }
}
