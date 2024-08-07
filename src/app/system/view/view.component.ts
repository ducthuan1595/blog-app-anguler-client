import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ResponsePostType } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { CommentType } from '../../models/comment.model';
import { LikeService } from '../../services/like.service';
import { UserType } from '../../models/user.model';
import { covertDateToDMY } from '../../util/formatDate';
import { ViewService } from '../../services/view.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit {
  post: ResponsePostType;
  comments: CommentType[];
  commentLength = 0;
  likers: UserType[];
  views = 0;
  isLoading = false;

  constructor(private router: Router, private postService: PostService, private commentService: CommentService, private viewService: ViewService) {}

  ngOnInit(): void {
    const data = history.state.data;    
    if(data) {
      console.log(data);
      this.post = data;

      this.viewService.getTotalView(data._id).subscribe(res => {
        this.views = res.data
      })

      this.commentService.getLengthComment(data._id).subscribe(res => {
        this.commentLength = res.data
      })
      
    }
  }

  formatDate(d: Date) {
    return covertDateToDMY(d);
  }
  onReturn() {
    this.router.navigate(['/system']);
  }

  onDelete() {
    const confirm = window.confirm('Are you sure?');
    if(confirm) {
      this.isLoading = true;
      this.postService.deletePost(this.post._id).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(res => {
        if(res.message === 'ok') {
          this.router.navigate(['/system']);   
        }
      })
    }
  }
}
