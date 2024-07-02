import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { ResponsePostType } from '../models/post.model';
import { UserType } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import {
  ManageService,
  ResCategoryType,
} from '../services/manage.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent implements OnInit {
  posts: ResponsePostType[] = [];
  user: UserType = null;
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
    
    this.authService.getLoggedUser().subscribe((res) => {
      if(res) {
        this.user = res;
      }
    });
    this.categoryService.getCategories().subscribe((res) => {
      if (res.message === 'ok') {
        this.categories = res.data;
      }
    });
  
    const currentRouteUrl = this.router.url.split('/')[2];
    
    if(currentRouteUrl) {
        this.postService.getPostsCategory(1, 4, currentRouteUrl).subscribe(res => {
          if(res.message === 'ok') {      
            this.navLink = currentRouteUrl;
            this.posts = res.data.posts;
          }
        })
      
    }else {
      this.fetchPost();
    }
    
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

  onCategoryPost(id: string, name: string) {
    if (id === 'all') {
      this.fetchPost();
      this.router.navigate(['/blog', id])
      this.navLink = id;
    } else {
      this.postService.getPostsCategory(1, 4, id).subscribe((res) => {
        if (res.message === 'ok') {

          this.router.navigate(['/blog', id])
          this.posts = res.data.posts;
          const convert = res.data.meta;
          this.currPage = +convert.currPage;
        this.nextPage = convert.nextPage;
        this.prevPage = convert.prevPage;
      this.navLink = id;
          
        }
      });
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
        const convert = res.data.meta;
        this.posts = res.data.posts;
        this.currPage = +convert.currPage;
        this.nextPage = convert.nextPage;
        this.prevPage = convert.prevPage;
      }
    });
    window.scrollTo(0,100);
  }
  onNextPage() {

    if (!this.nextPage) return;
    this.postService.getPosts(this.currPage + 1, 4).subscribe((res) => {
      if (res.message === 'ok') {
        const convert = res.data.meta;
        this.posts = res.data.posts;
        this.currPage = +convert.currPage;
        this.nextPage = convert.nextPage;
        this.prevPage = convert.prevPage;
      }
    });
    window.scrollTo(0,100);
  }

  fetchPost() {
    this.postService.getPosts(this.currPage, 4).subscribe((res) => {
      if (res.message === 'ok') {
        const convert = res.data.meta;
        this.nextPage = convert.nextPage;
        this.prevPage = convert.prevPage;
        this.posts = res.data.posts;
      }
    });
  }
}
