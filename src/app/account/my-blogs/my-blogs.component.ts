import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { ResponsePostPageType, ResponsePostType } from '../../models/post.model';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { UserType } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-blogs',
  templateUrl: './my-blogs.component.html',
  styleUrl: './my-blogs.component.css'
})
export class MyBlogsComponent implements OnInit {
  @Input() user!:UserType;
  posts: ResponsePostType[];

  currPage = 1;
  prevPage: boolean;
  nextPage: boolean;
  isPopup = '';
  isOpen = false;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.fetPosts();
  }


  openPopup(id: string) {
    this.isPopup = id;
    this.isOpen = !this.isOpen;
  }

  formatDate(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return ` ${day >= 10 ? day : '0' + day}-${month + 1}-${year}`;
  }
  onDetail(id: string, category:string) {
    this.router.navigate(['/blog-detail', id, category]);
  }
  onEdit(id: string) {
    this.router.navigate(['manage-blog', id])
  }

  onDelete(id: string) {
    this.postService.deletePost(id).subscribe(res => {
      if(res.message === 'ok') {
        const cpPost = [...this.posts];
        this.posts = cpPost.filter(post => post._id.toString() !== id.toString());
      }
    })
  }
  onPrevPage() {
    if (!this.prevPage) return;
    this.postService.getPosts(this.currPage - 1, 4).subscribe((res) => {
      if (res.message === 'ok') {
        this.posts = res.data.posts;
        const convert = res.data.meta;
        this.currPage = +convert.currPage;
        this.nextPage = convert.nextPage;
        this.prevPage = convert.prevPage;
      }
    });
  }
  onNextPage() {
    if (!this.nextPage) return;
    this.postService.getPosts(this.currPage + 1, 4).subscribe((res) => {
      if (res.message === 'ok') {
        
        this.posts = res.data.posts;
        const convert = res.data.meta;
        this.currPage = +convert.currPage;
        this.nextPage = convert.nextPage;
        this.prevPage = convert.prevPage;
        window.scrollTo(0,0);
      }
    });
  }

  fetPosts() {
    this.postService.getPostUser(1, 4).subscribe(res => {      
      if(res.message === 'ok') {
        const convert = res.data.meta;
        this.prevPage = convert.prevPage;
        this.nextPage = convert.nextPage;
        this.posts = res.data.posts;
        window.scrollTo(0,0);
      }
    })
  }
}
