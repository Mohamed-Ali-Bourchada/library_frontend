import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterModule],
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

  // Call the AuthService login method
  this.authService.login(this.email, this.password).subscribe(
    (response: any) => {
      this.errorMessage = '';

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
      this.errorMessage = 'Invalid email or password.';

      // Show error alert using SweetAlert2
      Swal.fire({
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  );
}
}
