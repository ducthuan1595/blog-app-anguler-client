import { Component, OnInit } from '@angular/core';
import { UserResponseType, AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  user: UserResponseType;

  constructor(private authService: AuthService, private route: ActivatedRoute) {};

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(res => {
      this.user = res.user;
    })
    const slug = this.route.snapshot.paramMap.get('slug');
    console.log(slug);
    
  }

  onLogout() {    
    this.authService.logout();
  }
}
