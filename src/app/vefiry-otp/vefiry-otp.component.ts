import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-vefiry-otp',
  templateUrl: './vefiry-otp.component.html',
  styleUrl: './vefiry-otp.component.css'
})
export class VefiryOtpComponent implements OnInit {
  isLoading = false;
  username = '';
  email = '';
  valueInput = '';
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.email = params.get('email');
      this.username = params.get('username');
    })
  }

  sendAgain() {
    this.valueInput = '';
    this.errorMessage = '';
    this.authService.sendAgainOtp(this.email, this.username).subscribe(res => {
      console.log(res);
      
    });
  }

  onSubmit() {
    if(!this.valueInput) return

    this.authService.verifyOtp(this.valueInput, this.email).subscribe(res => {
      
      if(res.message === 'ok') {
        localStorage.setItem('token_blog', JSON.stringify(res.data.tokens));
        localStorage.setItem('account_blog', JSON.stringify(res.data.user));
        this.authService.loggedUser.next(res.data.user);
        this.authService.loggedTokens.next(res.data.tokens);
        this.errorMessage = '';
        this.router.navigate(['']);
      }else {
        this.errorMessage = 'OTP code incorrect!'
      }
    }, (error) => {
      console.error(error);
      this.errorMessage = 'OTP code incorrect!'
    })

  }

}
