import { Component, OnInit } from '@angular/core';
import { ResponsePostType } from '../../models/post.model';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { CommentType } from '../../models/comment.model';
import { LikeService } from '../../services/like.service';
import { UserType } from '../../models/user.model';
import { covertDateToDMY } from '../../util/formatDate';

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

  constructor(private router: Router, private postService: PostService, private commentService: CommentService, private likedService: LikeService) {}

  ngOnInit(): void {
    const data = history.state.data;    
    if(data) {
      console.log(data);
      this.post = data;

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
      this.postService.deletePost(this.post._id).subscribe(res => {
        if(res.message === 'ok') {
          this.router.navigate(['/system']);   
        }
      })
    }
  }
}
