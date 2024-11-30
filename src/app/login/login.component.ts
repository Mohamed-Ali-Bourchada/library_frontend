import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  id:number | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
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

    // Call the login method from AuthService
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login successful', response);
        this.errorMessage = '';

        // Store the user details in localStorage and update the state
        const user = {
          username: response.fullName,  // Get full name from response
          isAdmin: response.isAdmin,
          id: response.id,        // Correctly extract 'id' from the response
        };
        this.authService.setUserDetails(user, response.token);  // Update the AuthService state

        // Redirect to the homepage after successful login
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid username or password.';
      }
    );
  }
}
