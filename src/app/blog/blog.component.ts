import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostService } from '../post.service';
import { ResponsePostType } from '../models/post.model';
import { UserResponseType, AuthService } from '../auth/auth.service';
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
  user: UserResponseType = null;
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
    this.fetchPost();
    this.authService.getLoggedUser().subscribe((res) => {
      this.user = res.user;
    });
    this.categoryService.getCategories().subscribe((res) => {
      console.log('get category',res);
      if (res.message === 'ok') {
        
        this.categories = res.data;
      }
    });
  
    const currentRouteUrl = this.router.url.split('/')[2];
    if(currentRouteUrl && this.categories) {
      const check = this.categories.find(item => item.name === currentRouteUrl);
      if(check) {
        this.postService.getPostsCategory(1, 4, check._id).subscribe(res => {
          if(res.message === 'ok') {            
            this.posts = res.data.posts;
          }
        })
      }
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

  onCategoryPost(category: string, name: string) {
    if (category === 'all') {
      this.fetchPost();
      this.router.navigate(['/blog', name])
      this.navLink = name;
    } else {
      this.postService.getPostsCategory(1, 4, category).subscribe((res) => {
        if (res.message === 'ok') {
          console.log(res.data.posts);

          this.router.navigate(['/blog', name])
          this.posts = res.data.posts;
          this.currPage = +res.data.currPage;
        this.nextPage = res.data.nextPage;
        this.prevPage = res.data.prevPage;
      this.navLink = name;
          
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
}
