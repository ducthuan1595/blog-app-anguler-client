import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ResponsePostType } from '../models/post.model';
import { PostService } from '../post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  posts: ResponsePostType[] = [];
  currPage: number = 1;
  nextPage: boolean;
  prevPage: boolean;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.postService.getPosts(this.currPage, 2).subscribe((res) => {
      console.log({res});
      
      if (res.message === 'ok') {
        this.nextPage = res.data.nextPage;
        this.prevPage = res.data.prevPage;
        this.posts = res.data.posts;
      }
    });
  }

  formatDate(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return ` ${day >= 10 ? day : '0' + day}-${month + 1}-${year}`;
  }

  onAuth() {
    this.router.navigate(['auth']);
    window.scrollTo(0,0);
  }

  onPrevPage() {
    if (!this.prevPage) return;
    this.postService.getPosts(this.currPage - 1, 2).subscribe((res) => {
      if (res.message === 'ok') {
        this.posts = res.data.posts;
        this.currPage = +res.data.currPage;
        this.nextPage = res.data.nextPage;
        this.prevPage = res.data.prevPage;
      }
    });
    window.scrollTo(0,1000);
  }
  onNextPage() {
    if (!this.nextPage) return;
    this.postService.getPosts(this.currPage + 1, 2).subscribe((res) => {
      if (res.message === 'ok') {
        this.posts = res.data.posts;
        this.currPage = +res.data.currPage;
        this.nextPage = res.data.nextPage;
        this.prevPage = res.data.prevPage;
      }
    });
    window.scrollTo(0,1000);
  }

  onDetail(id: string, category:string) {    
    this.router.navigate(['/blog-detail', id, category]);
    window.scrollTo(0,0);
  }
}
