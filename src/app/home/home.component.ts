import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ResponsePostType } from '../models/post.model';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { ManageService, ResCategoryType } from '../services/manage.service';
import { CommentService } from '../services/comment.service';
import { CommentType } from '../models/comment.model';
import { covertDateToDMY } from '../util/formatDate';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  posts: ResponsePostType[] = [];
  categories: ResCategoryType[] = [];
  currPage: number = 1;
  nextPage: boolean;
  prevPage: boolean;

  constructor(private postService: PostService, private router: Router, private categoryService: ManageService, private commentService: CommentService) {}

  ngOnInit(): void {
    this.postService.getPosts(this.currPage, 2).subscribe(async(res) => {
      if (res.message === 'ok') {
        this.nextPage = res.data.meta.nextPage;
        this.prevPage = res.data.meta.prevPage;

        const posts = res.data.posts.map((post) => {
            const data = {
              blogId: post._id,
              parentCommentId: null,
              limit: null,
              offset: null
            }
            this.commentService.getComment(data).subscribe(res => {
              if(res.message === 'ok') {
                post.comments = res.data
              }
            }) 
            
            return post;
        })
        
    
        console.log(posts);
        this.posts = posts;
      }
    });
    

    this.categoryService.getCategories().subscribe((res) => {
      if(res.message == 'ok') {
        this.categories = res.data.slice(0, 3);
      }
    });

  }

  formatDate(d: Date) {
    covertDateToDMY(d);
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
        this.currPage = +res.data.meta.currPage;
        this.nextPage = res.data.meta.nextPage;
        this.prevPage = res.data.meta.prevPage;
      }
    });
    window.scrollTo(0,1000);
  }
  onNextPage() {
    if (!this.nextPage) return;
    this.postService.getPosts(this.currPage + 1, 2).subscribe((res) => {
      if (res.message === 'ok') {
        this.posts = res.data.posts;
        this.currPage = +res.data.meta.currPage;
        this.nextPage = res.data.meta.nextPage;
        this.prevPage = res.data.meta.prevPage;
      }
    });
    window.scrollTo(0,1000);
  }

  onDetail(id: string, category:string) {    
    this.router.navigate(['/blog-detail', id, category]);
    window.scrollTo(0,0);
  }

  getCommentBlog(blogId: string):any {
    const data = {
      blogId,
      parentCommentId: null,
      limit: null,
      offset: null
    }
    this.commentService.getComment(data).subscribe(res => {
      if(res.message === 'ok') {
        console.log('comment', res.data);
        
        return res.data
      }
    })
  }
}
