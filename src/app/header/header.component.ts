import { Component, DoCheck, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {  AuthService } from '../services/auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { ResponsePostType } from '../models/post.model';
import { Location } from '@angular/common';
import { UserType } from '../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isUser = false;
  searchResult = '';
  posts: ResponsePostType[];
  isPopup = false;
  currURL = '';
  post: ResponsePostType;

  userClient: UserType;

  constructor(private authService: AuthService, private router: Router, private postService: PostService, private location: Location) {}

  ngOnInit(): void {
    const currentURL = this.router.url.split('/')[1];
    this.currURL = currentURL;    
    this.authService.getLoggedUser().subscribe((res) => {
      if(res) {        
        this.userClient = res;
        this.isUser = !!res;
      }
    });
  }

  onAccount() {    
    if(this.userClient._id) {
      this.router.navigate(['account', this.userClient._id]);
    }else {
      this.router.navigate(['auth']);
    }
  }

  onLogin() {
    this.router.navigate(['auth']);
  }

  onSearch() {        
    if(this.searchResult) {
      this.postService.searchPost(this.searchResult).subscribe(res => {
        if(res.message === 'ok') {
          this.posts = res.data;
          this.isPopup = !this.isPopup;
        }
      })
    }
  }

  onDetailPost(post: ResponsePostType) {        
      const navigationExtras: NavigationExtras = {
        state: {
          data: post,
        }
      }
      this.router.navigate(['/blog-detail', post._id, post.categoryId._id], navigationExtras);
      this.isPopup = false;
      this.searchResult = '';
  }
}
