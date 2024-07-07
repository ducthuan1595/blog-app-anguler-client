import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ResponsePostType } from '../models/post.model';
import { PostService } from '../services/post.service';
import { ManageService, ResCategoryType } from '../services/manage.service';
import { CommentService } from '../services/comment.service';
import { covertDateToDMY } from '../util/formatDate';
import { NotifyService } from '../services/notify.service';
import { LikeService } from '../services/like.service';
import { ViewService } from '../services/view.service';

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

  constructor(
    private postService: PostService, 
    private router: Router, 
    private categoryService: ManageService, 
    private commentService: CommentService, 
    private sanitizer: DomSanitizer, 
    private likeService: LikeService,
    private viewService: ViewService
  ) {}

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
          const base64 = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${(blog.userId.avatar.default).toString('base64')}`)
          blog.avatarSender = base64;

          // get total liked
          this.likeService.getLikers(blog._id).subscribe(res => {
            blog.totalLiked = res.data.length
          })

           // get total view
           this.viewService.getTotalView(blog._id).subscribe(res => {
            blog.views = res.data
          })
          
          this.commentService.getLengthComment(blog._id).subscribe(res => {
              if(res.message === 'ok') {
                blog.comments = res.data
              }
            }) 
            
            return blog;
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

  onDetail(id: string, category:string) {   
    console.log(id, category);
     
    this.router.navigate(['/blog-detail', id, category]);
    window.scrollTo(0,0);
  }
}
