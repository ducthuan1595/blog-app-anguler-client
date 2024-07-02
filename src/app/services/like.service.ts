import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVER } from '../util/contant';

@Injectable({ providedIn: 'root' })
export class LikeService {
  URL = URL_SERVER;

  constructor(private http: HttpClient) {}

  liked (blogId: string) {
    return this.http.post<{message: string, data: number}>(`${this.URL}/like`, {
      body: blogId
    });
  }

  unlike (blogId: string) {
    return this.http.delete<{message: string, data: number}>(`${this.URL}/like`, {
      body: blogId
    });
  }
}
