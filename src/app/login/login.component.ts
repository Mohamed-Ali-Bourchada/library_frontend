import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';  // Make sure the AuthService is imported
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel binding
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf and other directives

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],  // Add CommonModule here for ngIf
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = ''; // Variable to store error messages

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please fill in both fields.';
      return;
    }

    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Handle successful login
        console.log('Login successful', response);
        this.errorMessage = ''; // Clear any previous error messages
        // You can store the authentication token or user details in localStorage or state
      },
      (error) => {
        // Handle login error
        console.error('Login failed', error);
        this.errorMessage = 'Invalid username or password.';
      }
    );
  }
}
