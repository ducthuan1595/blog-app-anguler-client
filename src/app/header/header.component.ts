import { Component, DoCheck, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';

import {  AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { PostSearchType, ResponsePostType } from '../models/post.model';
import { UserType } from '../models/user.model';
import { NotifyService } from '../services/notify.service';
import { NotifyType } from '../models/notify.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isUser = false;
  searchResult = '';
  posts: PostSearchType[];
  isPopup = false;
  currURL = '';

  userClient: UserType;
  url_img = '';
  notifies: NotifyType[] | [] = []

  constructor(private authService: AuthService, private router: Router, private postService: PostService, private location: Location, private notifyService: NotifyService) {}

  ngOnInit(): void {
    const currentURL = this.router.url.split('/')[1];
    this.currURL = currentURL;    
    this.authService.getLoggedUser().subscribe((res) => {
      if(res) {        
  
        this.userClient = res;
        this.isUser = !!res;


        this.notifyService.getUnNotify().subscribe(res => {
          console.log('notifies', res);
          this.notifies = res?.data
          
        })
      }
    });

  }

  onLogin() {
    this.router.navigate(['auth']);
  }

  onSearch() {        
    if(this.searchResult) {
      this.postService.searchPost(this.searchResult).subscribe(res => {
        if(res.message === 'ok') {
          const data = res.data.map(post => {
            return JSON.parse(post.value.data)
          })
          
          this.posts = data;
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
      this.router.navigate(['/blog-detail', post._id, post.categoryId], navigationExtras);
      this.isPopup = false;
      this.searchResult = '';
  }

  openNotify() {
    this.router.navigate(['/notification'], {queryParams: {data: JSON.stringify(this.notifies)}});
  }
}
