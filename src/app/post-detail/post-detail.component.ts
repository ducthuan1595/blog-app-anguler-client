import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsePostPageType, ResponsePostType } from '../models/post.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit, DoCheck {
  post: ResponsePostType;
  posts: ResponsePostType[] = [];
  currPage: number = 1;
  nextPage: boolean;
  prevPage: boolean;

  changed = '';
  isChange = false;

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute) {}


  ngOnInit(): void {
    // HANDLE WHEN PARAMS CHANGED
    this.route.paramMap.subscribe((params) => {
      let id = params.get('id');
      let category = params.get('categoryId');
      this.fetchData(id, category);
    });
  }

  ngDoCheck(): void {    
  }

  fetchData(id:string, categoryId: string) {
    this.postService.getPostDetail(id).subscribe(res => {
      if(res.message === 'ok') {
        console.log(res.data);
                      
        this.post = res.data;
        this.changed = id;
        this.isChange = false;
      }
    })
    this.postService.getPostsCategory(1, 4, categoryId).subscribe(res => {
      if(res.message === 'ok') {
        this.posts = res.data.posts.filter(post => post._id.toString() !== id.toString())
        this.nextPage = res.data.nextPage;
        this.prevPage = res.data.prevPage;
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
  }

  onDetail(id:string, category:string) {    
    this.router.navigate(['/blog-detail', id, category]);
    window.scrollTo(0,0);
  }

}
