import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient // Added HttpClient for Basic Auth
  ) {}


onSubmit() {
  this.emailError = '';
  this.passwordError = '';
  this.errorMessage = '';

  // Validate email and password inputs
  if (!this.email) {
    this.emailError = 'Email is required.';
  }

  if (!this.password) {
    this.passwordError = 'Password is required.';
  }

  if (this.emailError || this.passwordError) {
    return;  // Prevent submission if there are errors
  }

  // Create Basic Auth header
  const base64Credentials = btoa(`${this.email}:${this.password}`);
  const headers = new HttpHeaders().set('Authorization', `Basic ${base64Credentials}`);

  // Call the AuthService login method
  this.authService.login(this.email, this.password, headers).subscribe(
    (response: any) => {
      console.log('Login successful', response);
      this.errorMessage = '';

      // Log email and password here to check if they are available
      console.log('Email:', this.email);
      console.log('Password:', this.password);  // Ensure password is logged here

      // Set user details in AuthService to manage session state
      const user = {
        username: response.fullName,  // Get full name from response
        isAdmin: response.isAdmin,
        id: response.id,              // Correctly extract 'id' from the response
        email: this.email,            // Store email
        password: this.password       // Store password
      };

      // Update AuthService state and session
      this.authService.setUserDetails(user);  // Store details, including password

      // Show success alert using SweetAlert2
      Swal.fire({
        title: 'Login Successful!',
        text: `Welcome back, ${response.fullName}! You have logged in successfully.`,
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000  // Auto-close the alert after 3 seconds
      }).then(() => {
        // Redirect to the homepage or dashboard after the alert
        this.router.navigate(['/']);
      });
    },
    (error) => {
      console.error('Login failed', error);
      this.errorMessage = 'Invalid email or password.';
    }
  );
}}
