import { Injectable } from '@angular/core';
import {
  ResponsePostType,
  RequestPostType,
  ResponsePostPageType,
} from './models/post.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface RequestPostTypeEdit extends RequestPostType {
  postId: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  URL = 'http://localhost:9000';

  constructor(private http: HttpClient, private router: Router) {}

  searchPost(key:string) {
    return this.http.get<{message: string; data: ResponsePostType[]}>(`${this.URL}/v1/api/search?search=${key}`);
  }

  getPosts(page: number, limit: number) {
    return this.http.get<{ message: string; data: ResponsePostPageType }>(
      `${this.URL}/v1/api/posts?page=${page}&limit=${limit}`
    );
  }

  getPostDetail(postId: string) {
    return this.http.get<{ message: string; data: ResponsePostType }>(
      `${this.URL}/v1/api/post-detail?postId=${postId}`
    );
  }

  getPostsCategory(page: number, limit: number, categoryId: string) {
    return this.http.get<{ message: string; data: ResponsePostPageType }>(
      `${this.URL}/v1/api/posts-category?page=${page}&limit=${limit}&categoryId=${categoryId}`
    );
  }
  getPostUser(page: number, limit: number) {
    return this.http.get<{ message: string; data: ResponsePostPageType }>(
      `${this.URL}/v1/api/posts-user?page=${page}&limit=${limit}`
    );
  }

  createPost(data: RequestPostType) {
    this.http.post<{ message: string; data: ResponsePostType }>(
      `${this.URL}/v1/api/create-post`,
      {
        ...data,
      }
    ).subscribe(res => {
      if(res.message === 'ok') {
        this.getPosts(1, 4);
        this.router.navigate(['blog'])
      }
    })
  }

  editPost(data: RequestPostTypeEdit) {
    this.http.put<{ message: string; data: ResponsePostType }>(
      `${this.URL}/v1/api/update-post`,
      {
        ...data,
      }
    ).subscribe(res => {
      if(res.message === 'ok') {
        this.getPosts(1, 4);
        this.router.navigate(['blog'])
      }
    })
  }

  deletePost(id: string) {
    return this.http.delete<{ message: 'ok' }>(
      `${this.URL}/v1/api/delete-post?postId=${id}`
    );
  }
}
