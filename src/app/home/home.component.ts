import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ResponsePostType } from '../models/post.model';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { ManageService, ResCategoryType } from '../services/manage.service';
import { CommentService } from '../services/comment.service';
import { CommentType } from '../models/comment.model';
import { covertDateToDMY } from '../util/formatDate';
import { finalize } from 'rxjs/operators';
import { LikeService } from '../services/like.service';
import { PendingInterceptor } from '../pedding.interceptor.spec';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  posts: ResponsePostType[] = [];
  categories: ResCategoryType[] = [];

  liked = 0;
  isLoading = false;

  constructor(private postService: PostService, private router: Router, private categoryService: ManageService, private commentService: CommentService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getFavoritePosts().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(async(res) => {
      if (res.message === 'ok') {   
        const posts = res.data.map((post: string) => {
          const blog = JSON.parse(post);
          this.commentService.getLengthComment(blog._id).subscribe(res => {
              if(res.message === 'ok') {
                blog.comments = res.data
              }
            }) 
            
            return blog;
        })
        
    
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

  onDetail(id: string, category:string) {   
    console.log(id, category);
     
    this.router.navigate(['/blog-detail', id, category]);
    window.scrollTo(0,0);
  }
}
