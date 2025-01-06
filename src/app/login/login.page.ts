import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage implements OnInit {

 

  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
      
        this.authService.setAuthStatus(true);
        this.router.navigate(['/tabs']);
      },
      error: (err) => {
        console.error(err);
        alert('Invalid credentials');
      },
    });
  }

  ngOnInit() {
  }

}
