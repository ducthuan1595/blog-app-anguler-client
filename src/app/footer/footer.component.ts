import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  isUser = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe((user) => {      
      this.isUser = !!user;
    });
  }
}
