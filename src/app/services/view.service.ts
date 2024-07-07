import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVER } from '../util/contant';

@Injectable({ providedIn: 'root' })
export class ViewService {

  constructor(private http: HttpClient) {}

  calcView (blogId: string) {
    return this.http.post<{message: string, data: number}>(`${URL_SERVER}/v1/api/view`, {
      blogId
    });
  }

  getTotalView (blogId: string) {
    return this.http.get<{message: string; data: number}>(`${URL_SERVER}/v1/api/view?blogId=${blogId}`)
  }

}
