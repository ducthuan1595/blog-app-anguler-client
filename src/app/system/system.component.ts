import {
  AfterContentInit,
  Component,
  DoCheck,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../auth/user.model';
import { PostService } from '../services/post.service';
import { ResponsePostType } from '../models/post.model';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrl: './system.component.css',
})
export class SystemComponent implements OnInit {
  user = null;
  searchValue = '';
  isPopup = false;
  isForm = false;
  posts: ResponsePostType[];
  constructor(private router: Router, private authService: AuthService, private postService: PostService) {}

  ngOnInit() {
    this.authService.getLoggedUser().subscribe((user) => {
      console.log(user);
      
      if(user && user.roleId.admin || user.roleId.moderator) {
        this.user = user;
      }else {
        this.router.navigate(['/']);
      }
    });
    this.authService.logoutUser.subscribe(() => {
      this.user = null;
    });
  }


  onSearch() {
    if(this.searchValue) {
      this.postService.searchPost(this.searchValue).subscribe(res => {
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
    this.router.navigate(['system/view', post._id], navigationExtras);
    this.isPopup = false;
    this.searchValue = '';
  }

  onLogout() {
    this.authService.logout();
  }
}
