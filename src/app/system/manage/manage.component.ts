import { Component, OnInit } from '@angular/core';
import { UploadCloudinary } from '../../services/uploadFile.service';
import { ManageService, ResCategoryType } from '../../services/manage.service';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { covertDateToDMY } from '../../util/formatDate';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class ManageComponent implements OnInit {
  image: { public_id: string; url: string } = {
    public_id: '',
    url: '',
  };
  previewImageUrl = '';
  name = '';

  isLoading = true;
  isEdit = false;
  categoryId = '';
  errMessage = '';

  categories: ResCategoryType[] = [];
  user = null;

  constructor(
    private cloundinary: UploadCloudinary,
    private manageService: ManageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getLoggedUser().subscribe((user) => {
      console.log({ user });
      this.user = user;
    });
    this.manageService.getCategories().subscribe((res) => {
      this.categories = res.data;
    });
  }

  onChange(event: any) {
    this.cloundinary.upload(event.target.files[0]).subscribe(
      (res) => {
        this.previewImageUrl = URL.createObjectURL(event.target.files[0]);

        this.image.public_id = res.public_id;
        this.image.url = res.url;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit(form: NgForm) {
    if (!form.valid || !this.user)
      return (this.errMessage = 'Value input valid! Please try again.');
    const data = {
      name: form.value.name,
      image: this.image,
    };
    if (this.isEdit) {
      this.manageService.editCategory(data, this.categoryId).subscribe(
        (res) => {
          if (res.message === 'ok') {
            const index = this.categories.findIndex(
              (item) => item._id === this.categoryId
            );
            if (index !== -1) {
              const updateCategory = this.categories[index];
              updateCategory.name = res.data.name;
              updateCategory.image = res.data.image;
              this.categories[index] = updateCategory;
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.manageService.createCategory(data).subscribe((res) => {
        this.categories.unshift(res.data);
      });
    }
    this.previewImageUrl = '';
    form.reset();
  }

  onUpdate(id: string) {
    this.isEdit = true;
    this.categoryId = id;
    this.categories.filter((item) => {
      if (item._id === id) {
        this.name = item.name;
        this.previewImageUrl = item.image.url;
      }
    });
    window.scrollTo(0, 560);
  }

  onDelete(id: string) {
    const confirm = window.confirm('Are you sure?');
    if (confirm) {
      this.manageService.removeCategory(id).subscribe((res) => {
        const updateCategory = this.categories.filter(
          (item) => item._id !== id
        );
        this.categories = updateCategory;
      });
    }
  }

  formatDate(d: Date) {
    return covertDateToDMY(d)
  }
}
