import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { URL_SERVER } from '../util/contant';

interface CategoryType {
  name: string;
  slogan: string;
  image: {
    public_id: string;
    url: string;
  };
}

export interface ResCategoryType extends CategoryType {
  createAt: Date;
  _id: string;
}

@Injectable({ providedIn: 'root' })
export class ManageService {
  categoriesChanged = new Subject<ResCategoryType[]>();
  URL = URL_SERVER;

  constructor(private http: HttpClient) {}

  createCategory(data: CategoryType) {
    return this.http.post<{ message: string; data: ResCategoryType }>(
      `${this.URL}/v1/api/category`,
      {
        ...data,
      }
    );
  }

  editCategory(data: CategoryType, id: string) {
    return this.http.put<{ message: string; data: ResCategoryType }>(
      `${this.URL}/v1/api/category`,
      {
        ...data,
        categoryId: id,
      }
    );
  }

  getCategories() {
    return this.http.get<{ message: String; data: ResCategoryType[] }>(
      `${this.URL}/v1/api/category`
    );
  }

  removeCategory(id: string) {
    return this.http.delete<{ message: string }>(
      `${this.URL}/v1/api/delete`, {
        body: id
      }
    );
  }
}
