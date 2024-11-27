import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';  // Import Router for navigation
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel binding
import { CommonModule } from '@angular/common';  // Import CommonModule for ngIf and other directives

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Add CommonModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // Variable to store the general error message
  emailError: string = ''; // For email specific error
  passwordError: string = ''; // For password specific error

  constructor(
    private authService: AuthService,
    private router: Router // Inject the Router service
  ) {}

  onSubmit() {
    this.emailError = '';  // Reset error messages
    this.passwordError = '';
    this.errorMessage = '';

    if (!this.email) {
      this.emailError = 'Email is required.';
    }

    if (!this.password) {
      this.passwordError = 'Password is required.';
    }

    if (this.emailError || this.passwordError) {
      return; // Don't proceed if there are validation errors
    }

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        // Handle successful login
        console.log('Login successful', response);
        this.errorMessage = ''; // Clear any previous error messages

        // Example of storing authentication token
        if (response.token) {
          localStorage.setItem('authToken', response.token);  // Assuming 'response.token' contains the JWT token
        }

        // Redirect to the app/home page after successful login
        this.router.navigate(['/']);  // Replace '/app' with the route you want to redirect to
      },
      (error) => {
        // Handle login error
        console.error('Login failed', error);
        this.errorMessage = 'Invalid username or password.';
      }
    );
  }
}
