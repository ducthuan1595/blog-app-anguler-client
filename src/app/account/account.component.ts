import { Component, OnInit } from '@angular/core';
import { Buffer } from 'buffer'
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import {  AuthService } from '../services/auth.service';
import { UserType } from '../models/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  user: UserType;
  url_img: SafeUrl;
  isNotify = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {};

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(res => {
      this.user = res;      
      const base64 = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${(res.avatar.default).toString('base64')}`);
      this.url_img = base64;    
    })

    const currentUrl = this.route.snapshot.url.join('/');
    console.log(currentUrl);
    
    if(currentUrl == 'notification') {
      this.isNotify = true
    }
    // this.route.paramMap.subscribe((params) => {

    // })
    
  }


  onLogout() {   
    this.authService.logout();
  }
}
