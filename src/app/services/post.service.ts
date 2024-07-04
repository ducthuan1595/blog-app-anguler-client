import { Injectable } from '@angular/core';
import {
  ResponsePostType,
  RequestPostType,
  ResponsePostPageType,
  ResponseFavoritePostPageType,
} from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVER } from '../util/contant';

export interface RequestPostTypeEdit extends RequestPostType {
  postId: string;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  URL = URL_SERVER;

  constructor(private http: HttpClient, private router: Router) {}

  searchPost(key:string) {
    return this.http.get<{message: string; data: ResponsePostType[]}>(`${this.URL}/v1/api/search?search=${key}`);
  }

  getPosts(page: number, limit: number) {
    return this.http.get<{ message: string; data: ResponsePostPageType }>(
      `${this.URL}/v1/api/blog?page=${page}&limit=${limit}`
    );
  }

  getFavoritePosts() {
    return this.http.get<{ message: string; data: any }>(
      `${this.URL}/v1/api/blog/favorite`
    );
  }

  getPostDetail(postId: string) {
    return this.http.get<{ message: string; data: ResponsePostType }>(
      `${this.URL}/v1/api/blog/detail-blog?blogId=${postId}`
    );
  }

  getPostsCategory(page: number, limit: number, categoryId: string) {
    return this.http.get<{ message: string; data: ResponsePostPageType }>(
      `${this.URL}/v1/api/blog/category?page=${page}&limit=${limit}&categoryId=${categoryId}`
    );
  }
  getPostUser(page: number, limit: number) {
    return this.http.get<{ message: string; data: ResponsePostPageType }>(
      `${this.URL}/v1/api/blog/user?page=${page}&limit=${limit}`
    );
  }

  createPost(data: RequestPostType) {
    return this.http.post<{ message: string; data: ResponsePostType }>(
      `${this.URL}/v1/api/blog`,
      {
        ...data,
      }
    )
  }

  editPost(data: RequestPostTypeEdit) {
    return this.http.put<{ message: string; data: ResponsePostType }>(
      `${this.URL}/v1/api/blog`,
      {
        ...data,
      }
    )
  }

  deletePost(id: string) {
    return this.http.delete<{ message: 'ok' }>(
      `${this.URL}/v1/api/blog?blogId=${id}`
    );
  }
}
