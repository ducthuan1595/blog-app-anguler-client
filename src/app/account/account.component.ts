import { Component, OnInit } from '@angular/core';
import {  AuthService } from '../services/auth.service';
import { UserType } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  user: UserType;

  constructor(private authService: AuthService, private route: ActivatedRoute) {};

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(res => {
      this.user = res;
    })
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log(slug);
    
  }

  onLogout() {    
    this.authService.logout();
  }
}
