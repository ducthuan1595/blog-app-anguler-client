import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UploadCloudinary {
  formData = new FormData();

  constructor(private http: HttpClient) {}

  upload(file: any) {
    this.formData.append('file', file);
    this.formData.append('upload_preset', 'ecommerce-book');
    this.formData.append('cloud_name', 'dvlbv612k');

    return this.http.post<{ public_id: string; url: string }>(
      'https://api.cloudinary.com/v1_1/dvlbv6l2k/image/upload',
      this.formData
    );
  }

  destroy(public_id: string) {
    return this.http.get<{ public_id: string; url: string }>(
      `https://api.cloudinary.com/v1_1/dvlbv6l2k/image/destroy?api_key=678197631371977&public_id=${public_id}`
    );
  }
}
