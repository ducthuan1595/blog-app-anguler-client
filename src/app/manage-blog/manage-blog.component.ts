import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import {
  ManageService,
  ResCategoryType,
} from '../services/manage.service';
import { AuthService } from '../services/auth.service';
import { UploadCloudinary } from '../services/uploadFile.service';
import { PostService } from '../services/post.service';
import { NgForm } from '@angular/forms';
import { RequestPostType, ResponsePostType } from '../models/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserType } from '../models/user.model';

@Component({
  selector: 'app-manage-blog',
  templateUrl: './manage-blog.component.html',
  styleUrl: './manage-blog.component.css',
})
export class ManageBlogComponent implements OnInit {
  isEdit = false;
  isLoading = false;
  postId = null;
  errMessage = '';
  title = '';
  categoryId='';
  desc= '';
  image: { public_id: string; url: string } = {
    public_id: '',
    url: '',
  };
  previewImageUrl: string = '';

  categories: ResCategoryType[] = [];
  userClient: UserType;

  constructor(
    private cloundinary: UploadCloudinary,
    private manageService: ManageService,
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.manageService.getCategories().subscribe((res) => {
      if (res.message === 'ok') {
        this.categories = res.data;
      }
    });
    this.authService.getLoggedUser().subscribe((res) => {
      this.userClient = res;
    });
    const id = this.route.snapshot.paramMap.get('postId');
    if(id) {
      this.postService.getPostDetail(id).subscribe(res => {
        if(res.message === 'ok') {
          this.postId = id;
          this.isEdit = true;
          this.title = res.data.title;
          this.desc = res.data.desc;
          this.previewImageUrl = res.data.image[0].url;
        }
      })
    }
  }

  onImage(event: any) {
    if (event.target.files) {
      this.cloundinary.upload(event.target.files[0]).subscribe(
        (res) => {
          this.image.public_id = res.public_id;
          this.image.url = res.url;
          this.previewImageUrl = res.url;
          console.log('Upload successful');
          this.isLoading = false;
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid || !this.userClient) {
      return this.errMessage = 'The fields are not empty!'
    }
    this.isLoading = true;
    const data: RequestPostType = {
      title: form.value.title,
      image: {
        public_id: this.image.public_id,
        url: this.image.url,
      },
      categoryId: form.value.categoryId,
      desc: form.value.desc,
    };

    if (this.isEdit && this.postId) {
      this.postService
        .editPost({ ...data, postId: this.postId }).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe(res => {
          if(res.message === 'ok') {
            this.postService.getPosts(1, 4);
            this.router.navigate(['blog'])
          }
        })
    } else {
      this.postService.createPost(data).subscribe(res => {
        if(res.message === 'ok') {
          this.postService.getPosts(1, 4);
          form.reset();
          this.router.navigate(['blog']);
        }
      })
    }
  }
}
