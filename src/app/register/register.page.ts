import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule,IonicModule],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPage implements OnInit {

  email = '';
  password = '';
  
  constructor(private authService: AuthService, private router: Router) {}



  register() {
    console.log("email", this.email)
    console.log("password", this.password)
    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        alert('Registration successful! You can now log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Registration failed. Please try again.');
      },
    });
  }


  ngOnInit() {
  }

}
