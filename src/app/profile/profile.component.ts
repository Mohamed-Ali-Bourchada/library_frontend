import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, RouterModule, CommonModule]
})
export class ProfileComponent {
  passwordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if newPassword and confirmNewPassword match
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;
    return newPassword && confirmNewPassword && newPassword !== confirmNewPassword
      ? { mismatch: true }
      : null;
  }

  // Method to generate Basic Auth header
  generateBasicAuthHeader(username: string, password: string): HttpHeaders {
    const credentials = btoa(`${username}:${password}`); // Encode credentials as base64
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`  // Add Authorization header
    });
  }

  // Form submit method to send data to the backend
  onSubmit() {
  const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm.value;

  // Encode credentials in Basic Auth format
  const email = "mohamed@gmail.com";// Replace with dynamically retrieved username
  const password = "123456"; // Replace with the user's password
console.log(email,password);
  const basicAuthHeader = 'Basic ' + btoa(email + ':' + password); // btoa encodes to base64

  this.http
    .put(`http://localhost:8081/api/users/change-password`, {
      currentPassword,
      newPassword,
      confirmNewPassword
    }, {
      headers: { 'Authorization': basicAuthHeader }
    })
    .subscribe({
      next: (response) => {
        this.successMessage = 'Password updated successfully!';
        this.errorMessage = ''; // Reset error message
      },
      error: (error) => {
        // Handle error
        this.errorMessage = error.error;
        this.successMessage = ''; // Reset success message
      }
    });
}

}
