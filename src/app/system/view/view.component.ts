import { Component, OnInit } from '@angular/core';
import { ResponsePostType } from '../../models/post.model';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit {
  post: ResponsePostType;

  constructor(private router: Router, private postService: PostService) {}

  ngOnInit(): void {
    const data = history.state.data;    
    if(data) {
      this.post = data;
    }
  }

  formatDate(d: Date) {    
    const date = new Date(d);
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return ` ${day >= 10 ? day : '0' + day}-${month + 1}-${year}`;
  }
  onReturn() {
    this.router.navigate(['/system/dashboard']);
  }

  onDelete() {
    const confirm = window.confirm('Are you sure?');
    if(confirm) {
      this.postService.deletePost(this.post._id).subscribe(res => {
        if(res.message === 'ok') {
          this.router.navigate(['/system/dashboard']);   
        }
      })
    }
  }
}
