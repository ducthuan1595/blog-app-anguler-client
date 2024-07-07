import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { ResponsePostType } from '../models/post.model';
import { UserType } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import {
  ManageService,
  ResCategoryType,
} from '../services/manage.service';
import { covertDateToDMY } from '../util/formatDate';

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
  limitPage = 4;
  navLink = 'all';
  isLoading = false;

  constructor(
    private router: Router,
    private postService: PostService,
    private authService: AuthService,
    private categoryService: ManageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
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
    
    if(currentRouteUrl && currentRouteUrl !== 'all') {
        this.postService.getPostsCategory(1, this.limitPage, currentRouteUrl).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe(res => {
          if(res.message === 'ok') {      
            this.navLink = currentRouteUrl;
            this.posts = res.data.posts;
            const convert = res.data.meta;
            this.currPage = +convert.currPage;
            this.nextPage =  convert.nextPage;
            this.prevPage = convert.prevPage;
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
      this.isLoading = true;
      this.postService.getPostsCategory(1, this.limitPage, id).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe((res) => {
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
    return covertDateToDMY(d)
  }

  onPrevPage() {
    if (!this.prevPage) return;
    this.isLoading = true;
    if(this.navLink === 'all') {
      this.postService.getPosts(this.currPage - 1, this.limitPage).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe((res) => {
        if (res.message === 'ok') {
          const convert = res.data.meta;
          this.posts = res.data.posts;
          this.currPage = +convert.currPage;
          this.nextPage = convert.nextPage;
          this.prevPage = convert.prevPage;
        }
      });
    }else {      
      this.postService.getPostsCategory(this.currPage - 1, this.limitPage, this.navLink).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe((res) => {
        if (res.message === 'ok') {
          const convert = res.data.meta;
          this.posts = res.data.posts;
          this.currPage = +convert.currPage;
          this.nextPage = convert.nextPage;
          this.prevPage = convert.prevPage;
        }
      });
    }
    window.scrollTo(0,100);
  }
  onNextPage() {
    this.isLoading = true;
    if (!this.nextPage) return;
    if(this.navLink === 'all') {
      this.postService.getPosts(this.currPage + 1, this.limitPage).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe((res) => {
        if (res.message === 'ok') {
          const convert = res.data.meta;
          this.posts = res.data.posts;
          this.currPage = +convert.currPage;
          this.nextPage = convert.nextPage;
          this.prevPage = convert.prevPage;
        }
      });
    }else {
      this.postService.getPostsCategory(this.currPage + 1, this.limitPage, this.navLink).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe((res) => {
        if (res.message === 'ok') {
          const convert = res.data.meta;
          this.posts = res.data.posts;
          this.currPage = +convert.currPage;
          this.nextPage = convert.nextPage;
          this.prevPage = convert.prevPage;
        }
      });
    }
    window.scrollTo(0,100);
  }

  fetchPost() {
    this.isLoading = true;
    this.postService.getPosts(1, this.limitPage).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe((res) => {
      if (res.message === 'ok') {
        const convert = res.data.meta;
        this.nextPage = convert.nextPage;
        this.prevPage = convert.prevPage;
        this.currPage = convert.currPage;
        this.posts = res.data.posts;
      }
    });
  }
}
