import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVER } from '../util/contant';
import { CommentType, CreateCommentType, DeleteCommentType, GetCommentType } from '../models/comment.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentService {
  URL = URL_SERVER;

  constructor(private http: HttpClient) {}

  createComment (data: CreateCommentType) {
    return this.http.post<{message: string, data: CommentType}>(`${this.URL}/v1/api/comment`, {
      ...data
    });
  }

  removeComment (data: DeleteCommentType) {
    return this.http.delete<{message: string, data: number}>(`${this.URL}/v1/api/comment`, {
      body: data
    });
  }

  getComment(data: GetCommentType): Observable<{ message: string; data: CommentType[] }> {
    let params = new HttpParams();
  
    params = params.set('blogId', data.blogId);
  
    if (data.parentCommentId !== null) {
      params = params.set('parentCommentId', data.parentCommentId);
    }
  
    if (data.limit !== null) {
      params = params.set('limit', data.limit.toString());
    }
  
    if (data.offset !== null) {
      params = params.set('offset', data.offset.toString());
    }
  
    return this.http.get<{ message: string; data: CommentType[] }>(`${this.URL}/v1/api/comment`, { params });
  }
  
}
