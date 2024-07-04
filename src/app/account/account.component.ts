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
      console.log(res, '///////////////////');
      
      this.user = res;
    })
    
  }

  onLogout() {   
    console.log('loutgout');
     
    this.authService.logout();
  }
}
