import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { PostService } from '../../services/post.service';
import { ResponsePostType } from '../../models/post.model';
import { NavigationExtras, Router } from '@angular/router';
import { covertDateToDMY } from '../../util/formatDate';

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
  isLoading = false;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(1, 10).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(res => {
      if(res.message === 'ok') {
        this.prevPage = res.data.meta.prevPage;
        this.nextPage = res.data.meta.nextPage;
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
    return covertDateToDMY(d)
  }

  onPrevPage() {
    if (!this.prevPage) return;
    this.postService.getPosts(this.currPage - 1, 4).subscribe((res) => {
      if (res.message === 'ok') {
        this.posts = res.data.posts;
        this.currPage = +res.data.meta.currPage;
        this.nextPage = res.data.meta.nextPage;
        this.prevPage = res.data.meta.prevPage;
      }
    });
  }
  onNextPage() {

    if (!this.nextPage) return;
    this.postService.getPosts(this.currPage + 1, 4).subscribe((res) => {
      if (res.message === 'ok') {
        
        this.posts = res.data.posts;
        this.currPage = +res.data.meta.currPage;
        this.nextPage = res.data.meta.nextPage;
        this.prevPage = res.data.meta.prevPage;
      }
    });
  }
}
