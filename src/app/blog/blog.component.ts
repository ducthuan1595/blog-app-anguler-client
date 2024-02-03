import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostService } from '../post.service';
import { ResponsePostType } from '../models/post.model';
import { AuthResponseType, AuthService } from '../auth/auth.service';
import {
  ManageService,
  ResCategoryType,
} from '../system/manage/manage.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent implements OnInit {
  posts: ResponsePostType[] = [];
  user: AuthResponseType = null;
  categories: ResCategoryType[] = [];
  currPage: number = 1;
  nextPage: boolean;
  prevPage: boolean;
  navLink = 'all';

  constructor(
    private router: Router,
    private postService: PostService,
    private authService: AuthService,
    private categoryService: ManageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe((data) => {
      this.user = data.user;
    });
    this.categoryService.getCategories().subscribe((res) => {
      if (res.message === 'ok') {
        this.categories = res.data;
        const currentRouteUrl = this.router.url.split('/')[2];
        if (currentRouteUrl) {
          const category = res.data.find(
            (item) =>
              item.name.toLocaleLowerCase() === currentRouteUrl.toLocaleLowerCase()
          );
          if (category) {
            this.fetchPostByCategory(category._id, currentRouteUrl);
          }
        }else {
          this.fetchPost();
        }
      }
    });

  }

  onActive() {
    if (this.user) {
      this.router.navigate(['manage-blog']);
    } else {
      this.router.navigate(['auth']);
    }
  }

  onDetail(id: string, category:string) {
    this.router.navigate(['/blog-detail', id, category]);
    window.scrollTo(0,0)
  }

  onCategoryPost(categoryId: string, name: string) {
    if (name === 'all') {
      this.fetchPost();
      this.router.navigate(['/blog', name])
      this.navLink = name;
    } else {
      this.fetchPostByCategory(categoryId, name);
    }
  }

  formatDate(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return ` ${day >= 10 ? day : '0' + day}-${month + 1}-${year}`;
  }

  onPrevPage() {
    if (!this.prevPage) return;
    this.postService.getPosts(this.currPage - 1, 4).subscribe((res) => {
      if (res.message === 'ok') {
        this.posts = res.data.posts;
        this.currPage = +res.data.currPage;
        this.nextPage = res.data.nextPage;
        this.prevPage = res.data.prevPage;
      }
    });
    window.scrollTo(0,100);
  }
  onNextPage() {

    if (!this.nextPage) return;
    this.postService.getPosts(this.currPage + 1, 4).subscribe((res) => {
      if (res.message === 'ok') {
        
        this.posts = res.data.posts;
        this.currPage = +res.data.currPage;
        this.nextPage = res.data.nextPage;
        this.prevPage = res.data.prevPage;
      }
    });
    window.scrollTo(0,100);
  }

  fetchPost() {
    this.postService.getPosts(this.currPage, 4).subscribe((res) => {
      if (res.message === 'ok') {
        this.nextPage = res.data.nextPage;
        this.prevPage = res.data.prevPage;
        this.posts = res.data.posts;
      }
    });
  }

  fetchPostByCategory(categoryId:string, name:string) {
    this.postService.getPostsCategory(1, 4, categoryId).subscribe((res) => {
      if (res.message === 'ok') {        
        this.router.navigate(['/blog', name]);
        this.posts = res.data.posts;
        this.currPage = +res.data.currPage;
        this.nextPage = res.data.nextPage;
        this.prevPage = res.data.prevPage;
        this.navLink = name;
      }
    });
  }
}
