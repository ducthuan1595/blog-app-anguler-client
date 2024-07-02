import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { UserType } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private user: UserType;
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const tokens = JSON.parse(localStorage.getItem('token_blog')) ?? null;
    // return next.handle(req);
    
    this.authService.getLoggedUser().subscribe((res) => {
      if (res) {        
        this.user = res;
      }
    });
    // if (this.userRole?.admin || this.userRole?.moderator) {
    //   if (
    //     req.url.includes('/v1/api/category') ||
    //     req.url.includes('/v1/api/-category') ||
    //     req.url.includes('/v1/api/category') ||
    //     req.url.includes('/v1/api/blog') ||
    //     req.url.includes('/v1/api/user/blog') ||
    //     req.url.includes('/v1/api/delete-post')
    //   ) {
        
    //     const authRequest = req.clone({
    //       headers: req.headers.set('Authorization', `Bearer ${this.token}`),
    //     });
    //     return next.handle(authRequest);
    //   }
    // }

    if (
      this.user && tokens &&
      (req.url.includes('/v1/api/comment') && req.method === 'POST')
      // req.url.includes('/v1/api/update-post') ||
      // req.url.includes('/v1/api/delete-post') ||
      // req.url.includes('/v1/api/posts-user') ||
      // req.url.includes('/v1/api/delete-post')
      
    ) {
      console.log(tokens.access_token);
      
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${tokens.access_token}`),
      });
      return next.handle(authRequest);
    }

    return next.handle(req);
  }
}
