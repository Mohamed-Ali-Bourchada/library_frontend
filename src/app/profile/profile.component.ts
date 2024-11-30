import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, RouterModule, CommonModule]
})
export class ProfileComponent implements OnInit {
  userForm: FormGroup;
  passwordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  userId: number | null = null;
  isLoading: boolean = false;
  userInfo: { fullName: any; email: any; adresse: any; telephone: any; dateNaiss: any; } | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required], // Match database field name
      dateNaiss: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.minLength(6), Validators.required]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userIdFromRoute = Number(params.get('id'));
      if (userIdFromRoute) {
        this.userId = userIdFromRoute;
        this.getUserProfile();
      } else {
        this.errorMessage = 'User ID is required for the profile page.';
      }
    });
  }

  getUserProfile(): void {
    if (this.userId) {
      this.isLoading = true;
      this.http.get(`http://localhost:8081/api/users/${this.userId}/profile`)
        .subscribe(
          (response: any) => {
            if (response) {
              this.userInfo = {
                fullName: response.fullName || 'N/A',
                email: response.email || 'N/A',
                adresse: response.adresse || 'N/A',
                telephone: response.telephone || 'N/A',
                dateNaiss: response.dateNaiss || 'N/A',
              };

              // Pre-fill the form
              this.userForm.patchValue({
                fullName: response.fullName || '',
                email: response.email || '',
                adresse: response.adresse || '',
                telephone: response.telephone || '', // Populate telephone field
                dateNaiss: response.dateNaiss || ''
              });
            }
            this.isLoading = false;
          },
          (error) => {
            this.errorMessage = error?.message || 'Failed to load user profile.';
            this.isLoading = false;
          }
        );
    }
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;
    return newPassword && confirmNewPassword && newPassword !== confirmNewPassword
      ? { 'mismatch': true }
      : null;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    // Extract user data
    const userData = {
      fullName: this.userForm.value.fullName,
      email: this.userForm.value.email,
      adresse: this.userForm.value.adresse,
      telephone: this.userForm.value.telephone, // Use correct field name
      dateNaiss: this.userForm.value.dateNaiss
    };

    this.isLoading = true;

    this.http.put(`http://localhost:8081/api/users/${this.userId}/update`, userData)
      .subscribe(
        response => {
          this.isLoading = false;
          this.successMessage = 'Profile updated successfully!';
        },
        error => {
          this.isLoading = false;
          this.errorMessage = 'Failed to update profile: ' + (error.error || error.message);
        }
      );
  }

onChangePassword(): void {
  if (this.passwordForm.invalid) {
    this.errorMessage = 'Please fill in all fields correctly.';
    return;
  }

  const currentPassword = this.passwordForm.get('currentPassword')?.value;
  const newPassword = this.passwordForm.get('newPassword')?.value;
  const confirmNewPassword = this.passwordForm.get('confirmNewPassword')?.value;

  this.isLoading = true;
  this.http.put(`http://localhost:8081/api/users/${this.userId}/change-password`, {
    currentPassword,
    newPassword,
    confirmNewPassword
  }).subscribe(
    response => {
      this.successMessage = 'Password updated successfully!';
      this.isLoading = false;
    },
    error => {
      console.error('Error Response:', error); // Log full error response
      // Handle different HTTP status codes
      if (error.status === 400) {
        this.errorMessage = error.error || 'Bad request. Please check your inputs.';
      } else if (error.status === 403) {
        this.errorMessage = 'You are not authorized to change this password.';
      } else if (error.status === 500) {
        this.errorMessage = 'An error occurred while updating the password.';
      } else {
        this.errorMessage = 'Unexpected error occurred.';
      }
      this.isLoading = false;
    }
  );
}



}
