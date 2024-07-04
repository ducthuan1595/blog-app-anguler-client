import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVER } from '../util/contant';
import { UserType } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class LikeService {
  URL = URL_SERVER;

  constructor(private http: HttpClient) {}

  liked (blogId: string) {
    return this.http.post<{message: string, data: number}>(`${this.URL}/v1/api/like`, {
      blogId
    });
  }

  getLikers (blogId: string) {
    return this.http.get<{message: string; data: any}>(`${this.URL}/v1/api/like?blogId=${blogId}`)
  }

}
