import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private token = null;
  private userRole = '';
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    // return next.handle(req);
    this.authService.getLoggedUser().subscribe((data) => {
      
      if (data && data.user && data.token) {
        this.token = data.token;
        this.userRole = data.user.role;
      }
    });
    if (this.userRole === 'F2') {
      if (
        req.url.includes('/v1/api/update-category') ||
        req.url.includes('/v1/api/create-category') ||
        req.url.includes('/v1/api/delete-category') ||
        req.url.includes('/v1/api/create-post') ||
        req.url.includes('/v1/api/update-post') ||
        req.url.includes('/v1/api/delete-post') ||
        req.url.includes('/v1/api/posts-user') ||
        req.url.includes('/v1/api/delete-post')
      ) {
        const authRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${this.token}`),
        });
        return next.handle(authRequest);
      }
    } else if (this.userRole == 'F1') {
      if (
        req.url.includes('/v1/api/create-post') ||
        req.url.includes('/v1/api/update-post') ||
        req.url.includes('/v1/api/delete-post') ||
        req.url.includes('/v1/api/posts-user') ||
        req.url.includes('/v1/api/delete-post')
        
      ) {
        const authRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${this.token}`),
        });
        return next.handle(authRequest);
      }
    }

    return next.handle(req);
  }
}
