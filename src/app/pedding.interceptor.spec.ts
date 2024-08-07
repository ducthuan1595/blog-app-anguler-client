import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class PendingInterceptor implements HttpInterceptor {
  private pendingRequests = 0;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.pendingRequests++;
    
    return next.handle(request).pipe(
      finalize(() => {
        
        this.pendingRequests--;
      })
    );
  }
  
  get isPending(): boolean {    
    return this.pendingRequests > 0;
  }
}
