import { Component, OnInit } from '@angular/core';
import { Buffer } from 'buffer'
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import {  AuthService } from '../services/auth.service';
import { UserType } from '../models/user.model';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  user: UserType;
  url_img: SafeUrl;
  isNotify = false;
  isLoading = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private notifyService: NotifyService, private router: Router) {};

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(res => {
      this.user = res;      
      const base64 = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${(res.avatar.default).toString('base64')}`);
      this.url_img = base64;    
    })

    const currentUrl = this.route.snapshot.url.join('/');    
    if(currentUrl == 'notification') {
      this.isLoading = true;
      this.isNotify = true;
      this.notifyService.getUnNotify().pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(res => {
        this.router.navigate(['/notification'], {queryParams: {data: JSON.stringify(res.data)}});
      })
    }else {
      this.isNotify = false;
    }
    // this.route.paramMap.subscribe((params) => {

    // })
    
  }

  onLogout() {   
    this.authService.logout();
  }
}
