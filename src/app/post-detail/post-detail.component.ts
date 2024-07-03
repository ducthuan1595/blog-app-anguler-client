import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsePostPageType, ResponsePostType } from '../models/post.model';
import { CommentService } from '../services/comment.service';
import { AuthService } from '../services/auth.service';
import { UserType } from '../models/user.model';
import { CommentType, CreateCommentType, GetCommentType, CommentAllType } from '../models/comment.model';
import { covertDateToDMY } from '../util/formatDate';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  post: ResponsePostType;
  posts: ResponsePostType[] = [];
  comments: CommentAllType[] = [];
  currPage: number = 1;
  nextPage: boolean;
  prevPage: boolean;
  user: UserType = null;
  commentValue = '';
  commentId: string = '';

  changed = '';
  isChange = false;
  isMore = false;
  currentCommentPage = 1;
  isMoreComment = true;

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute, private commentService: CommentService, private authService: AuthService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');    
    const categoryId = this.route.snapshot.paramMap.get('categoryId');    
    if(id && categoryId) {
      this.postService.getPostDetail(id).subscribe(res => {
        if(res.message === 'ok') {   
          let post = res.data;
          this.post = post;
          
          this.changed = id;
          this.isChange = false;
          this.getComment();
        }
      });
      this.fetchData(categoryId, id);
      this.authService.getLoggedUser().subscribe((res) => {
        if(res) {
          this.user = res;
        }
      });
    }
    
  }

  // ngDoCheck(): void {    
    
  //   const data = history.state.data;
  //   // if(this.changed.toString() !== data._id.toString()) {
  //   //   this.isChange = true;
  //   // }
  //   // if(this.isChange) {
  //   //   console.log('post');
      
  //   // }
  //   const id = this.route.snapshot.paramMap.get('id');    
  //   const categoryId = this.route.snapshot.paramMap.get('categoryId');  
  //   if(this.changed.toString() !== id.toString())  this.isChange = true;
  //   if(this.isChange) {  
  //     this.fetchData(id, categoryId)
  //     this.isChange = false;
  //   }
  // }

  fetchData(categoryId: string, id:string) {
    
    this.postService.getPostsCategory(1, 4, categoryId).subscribe(res => {
      if(res.message === 'ok') {
        this.posts = res.data.posts.filter(post => post._id.toString() !== id.toString())
        this.nextPage = res.data.meta.nextPage;
        this.prevPage = res.data.meta.prevPage;
      }
    });
  }

  formatDate(d: Date) {    
    return covertDateToDMY(d);
  }

  onPrevPage() {
    if (!this.prevPage) return;
    this.postService.getPosts(this.currPage - 1, 2).subscribe((res) => {
      if (res.message === 'ok') {
        const convert = res.data.meta;
        this.posts = res.data.posts;
        this.currPage = +convert.currPage;
        this.nextPage = convert.nextPage;
        this.prevPage = convert.prevPage;
      }
    });
  }
  onNextPage() {
    if (!this.nextPage) return;
    this.postService.getPosts(this.currPage + 1, 2).subscribe((res) => {
      if (res.message === 'ok') {
        this.posts = res.data.posts;
        const convert = res.data.meta;
        this.currPage = +convert.currPage;
        this.nextPage = convert.nextPage;
        this.prevPage = convert.prevPage;
      }
    });
  }

  onDetail(id:string, category:string) {
    this.router.navigate(['/blog-detail', id, category]);
    window.scrollTo(0,0);
  }

  getComment() {    
    let data = {
        blogId: this.post._id,
        parentCommentId: null,
        limit: 2,
        offset: this.currentCommentPage
    }
    
    this.commentService.getComment(data).subscribe(res => {
      if(res.message === 'ok') {
        if(res.data.length < 1) this.isMoreComment = false;
        this.comments.push(...res.data);
        // this.comments = res.data;
        res.data.map(comment => {   
          this.getParentComment(comment);
        })
      }
    }) 
  }

  getParentComment(comment: CommentType) {        
    let data = {
        blogId: this.post._id,
        parentCommentId: comment._id,
        limit: null,
        offset: null
    }

    this.commentService.getComment(data).subscribe(res => {
      if(res.message === 'ok') {

        for(let i of this.comments) {
          if(i._id === comment._id) {
            i.replies = res.data
          }
        }
       
      }
    }) 
  }

  addComment(parentCommentId: string | null, index: number | null) {
    if(!this.user) this.router.navigate(['auth']);
    let data: CreateCommentType;
    if(parentCommentId) {
      data = {
        blogId: this.post._id,
        userId: this.user._id,
        content: this.commentValue,
        parentCommentId
      }
    }else {
      data = {
        blogId: this.post._id,
        userId: this.user._id,
        content: this.commentValue,
      }
    }

    this.commentService.createComment(data).subscribe(res => {
      if(res.message === 'ok') {
        if(!parentCommentId) {
          return this.comments.unshift(res.data);
        }
        this.comments[index].replies.unshift(res.data);
      }
    })
    this.commentValue = '';
    this.commentId = ''
  }

  onReply(commentId: string) {    
    this.commentId = commentId;
  }

  showMore() {
    this.isMore = true;
  }

  onShowMoreComment() {    
    ++this.currentCommentPage;
    this.getComment();
  }
}
