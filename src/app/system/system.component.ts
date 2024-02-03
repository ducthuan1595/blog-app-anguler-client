import {
  AfterContentInit,
  Component,
  DoCheck,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { PostService } from '../post.service';
import { ResponsePostType } from '../models/post.model';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrl: './system.component.css',
})
export class SystemComponent implements OnInit, DoCheck {
  user = null;
  searchValue = '';
  isPopup = false;
  isForm = false;
  posts: ResponsePostType[];
  constructor(private router: Router, private authService: AuthService, private postService: PostService) {}

  ngOnInit() {
    this.authService.getLoggedUser().subscribe((data) => {      
      if(data && data.user.role === 'F2') {
        this.user = data.user;
      }
    });
    this.authService.logoutUser.subscribe(() => {
      this.user = null;
    });
  }

  ngDoCheck(): void {
    const currURL = this.router.url.split('/')[2];
    if(currURL == 'dashboard') {
      this.isForm = true;
    }else {
      this.isForm = false;
    }
  }

  onSearch() {
    if(this.searchValue) {
      this.postService.searchPost(this.searchValue).subscribe(res => {
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
    this.router.navigate(['system/view', post._id], navigationExtras);
    this.isPopup = false;
    this.searchValue = '';
  }

  onLogout() {
    this.authService.logoutAd();
    this.user = null;
  }
}
