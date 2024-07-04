import { Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsePostPageType, ResponsePostType } from '../models/post.model';
import { CommentService } from '../services/comment.service';
import { AuthService } from '../services/auth.service';
import { UserType } from '../models/user.model';
import { CommentType, CreateCommentType, GetCommentType, CommentAllType } from '../models/comment.model';
import { covertDateToDMY } from '../util/formatDate';
import { BehaviorSubject } from 'rxjs';
import { LikeService } from '../services/like.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit, OnChanges {
  post: ResponsePostType;
  posts: ResponsePostType[] = [];
  comments: CommentAllType[] = [];
  currPage: number = 1;
  nextPage: boolean;
  prevPage: boolean;
  user: UserType = null;
  commentValue = '';
  commentId: string = '';
  commentLength = 0;
  liked = 0;

  isMore = false;
  currentCommentPage = 1;
  isMoreComment = true;
  private blogDetailSubject = new BehaviorSubject<any>(null);
  blogDetailObservable$ = this.blogDetailSubject.asObservable();

  constructor(private postService: PostService, private router: Router, private route: ActivatedRoute, private commentService: CommentService, private authService: AuthService, private likedService: LikeService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.comments = [];
      this.currPage = 1;
      this.currentCommentPage = 1
      this.isMoreComment = true;
      this.isMore = false;
      this.fetchDate(params.get('id'), params.get('categoryId'));
    });
    this.authService.getLoggedUser().subscribe((res) => {
      if(res) {
        this.user = res;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] || changes['categoryId']) {
      this.fetchDate(changes['id'].currentValue, changes['categoryId'].currentValue);
    }
  }

  fetchDate (id: string, categoryId: string) {
      
    if(id && categoryId) {
      this.postService.getPostDetail(id).subscribe(res => {
        if(res.message === 'ok') {   
          let post = res.data;
          this.post = post;
          this.liked = post.totalLiked;
          this.commentService.getLengthComment(post._id).subscribe(res => {
            this.commentLength = res.data
          })
          this.getComment();
        }
      });
      this.fetchDataCategory(categoryId, id);
    }
  }

  fetchDataCategory(categoryId: string, id:string) {
    
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
    this.blogDetailSubject.next({ id, category });
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

  onLiked(blogId: string) {
    this.likedService.liked(blogId).subscribe(res => {
      this.liked = res.data;
    })
  }
}
