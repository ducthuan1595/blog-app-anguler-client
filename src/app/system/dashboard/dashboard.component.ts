import { Component, OnInit } from '@angular/core';
import { PostService } from '../../post.service';
import { ResponsePostType } from '../../models/post.model';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  posts: ResponsePostType[] = [];
  currPage: number = 1;
  nextPage: boolean;
  prevPage: boolean;
  isForm = true;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.postService.getPosts(1, 10).subscribe(res => {
      if(res.message === 'ok') {
        this.prevPage = res.data.prevPage;
        this.nextPage = res.data.nextPage;
        this.posts = res.data.posts;
      }
    })
  }

  onView(post: ResponsePostType) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: post,
      }
    }
    this.router.navigate(['system/view', post._id], navigationExtras);
  }

  onDelete(id: string) {
    const confirm = window.confirm('Are you sure?');
    if(confirm) {
      this.postService.deletePost(id).subscribe(res => {
        if(res.message === 'ok') {
          console.log(res);
          
          const cpPosts = [...this.posts];
          this.posts = cpPosts.filter(post => post._id.toString() !== id.toString());
        }
      })
    }
  }

  formatDate(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return ` ${day >= 10 ? day : '0' + day}/${month + 1}/${year}`;
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
  }
}
