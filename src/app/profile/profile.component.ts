import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Import AuthService
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, RouterModule, CommonModule]
})
export class ProfileComponent implements OnInit {
  userInfoForm: FormGroup;  // Form for updating user info
  passwordForm: FormGroup;  // Form for changing the password
  successMessage: string = '';
  errorMessage: string = '';
  successMessagePassword: string = '';
  errorMessagePassword: string = '';
  successMessageDelete: string = '';
  errorMessageDelete: string = '';
  email: string = '';
  password: string = '';
  userId: number | null = null;
  isPasswordChangeVisible= false;
  isDeleteAccountVisible = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService  // Inject AuthService
  ) {
    // Initialize user information form
    this.userInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required],
      dateNaiss: ['', Validators.required],
    });

    // Initialize password change form
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    // Retrieve user details from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.email = parsedUser.email;
      this.password = parsedUser.password;
      this.userId = parsedUser.id; // Assuming user data includes an id
      this.getUserInfo();  // Fetch user info to pre-fill the form
    }
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
  generateBasicAuthHeader(): HttpHeaders {
    const credentials = btoa(`${this.email}:${this.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
    });
  }

  // Get the user information from the backend to pre-fill the form
  getUserInfo(): void {
    if (this.userId) {
      this.http.get(`http://localhost:8081/api/users/${this.userId}/profile`).subscribe(
        (response: any) => {
              console.log(response);  // Log the full response to verify the structure

          if (response) {
            this.userInfoForm.patchValue({
              fullName: response.fullName || '',
              email: response.email || '',
              adresse: response.adresse|| '',
              telephone: response.telephone || '',
              dateNaiss: response.dateNaiss || ''
            });
          }
        },
        (error) => {
          this.errorMessage = error?.message || 'Failed to load user information.';
        }
      );
    }
  }

  // Form submit method for updating user information
  onUpdateUserInfo(): void {
    if (this.userInfoForm.invalid) {
      return;
    }

    const userData = this.userInfoForm.value;
    this.http
      .put(`http://localhost:8081/api/users/${this.userId}/update`, userData)
      .subscribe(
        (response) => {
          this.successMessage = 'User information updated successfully!';
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = 'Failed to update user information: ' + (error.error || error.message);
        }
      );
  }

  // Form submit method for changing the password
  onChangePassword(): void {
    const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm.value;

    // Check if the form is valid
    if (this.passwordForm.invalid) {
      return;
    }

    // Encode credentials in Basic Auth format
    const basicAuthHeader = this.generateBasicAuthHeader();

    this.http
      .put(
        `http://localhost:8081/api/users/change-password`,
        { currentPassword, newPassword, confirmNewPassword },
        { headers: basicAuthHeader, observe: 'response' }
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status === 200) {
            this.successMessagePassword = 'Password updated successfully!';
            this.errorMessagePassword= ''; // Reset error message

            // Log the user out after successful password change
            this.authService.logout();
            this.router.navigate(['/login']); // Redirect to login page after logout
          } else {
            this.successMessage = '';
            this.errorMessage = 'An unexpected error occurred while changing the password.';
          }
        },
        error: (error) => {
          this.errorMessage = error.error || 'Failed to change password.';
        },
      });
  }

  // Helper method to display validation error messages for the user info form
  get userInfoError() {
    const control = this.userInfoForm;
    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  // Helper method to display validation error messages for the password form
  get currentPasswordError() {
    const control = this.passwordForm.get('currentPassword');
    if (control?.hasError('required')) {
      return 'Current password is required';
    }
    return '';
  }

  get newPasswordError() {
    const control = this.passwordForm.get('newPassword');
    if (control?.hasError('required')) {
      return 'New password is required';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  get confirmNewPasswordError() {
    const control = this.passwordForm.get('confirmNewPassword');
    if (control?.hasError('required')) {
      return 'Confirm password is required';
    }
    if (control?.hasError('mismatch')) {
      return 'New password and confirm password do not match';
    }
    return '';
  }
   togglePasswordChange() {
  this.isPasswordChangeVisible = !this.isPasswordChangeVisible;

}
 toggleDeleteAccount(): void {
    this.isDeleteAccountVisible = !this.isDeleteAccountVisible;
  }
// Method for deleting the user account
onDeleteAccount(): void {
  if (!this.userId) {
    this.errorMessageDelete = 'User ID not found.';
    return;
  }

  // Assuming AuthService provides necessary authentication headers (like Bearer token)
  const headers = this.generateBasicAuthHeader();  // Ensure this method exists in your AuthService

  this.http.delete(`http://localhost:8081/api/users/${this.userId}/delete`, { headers }).subscribe(
    (response) => {
      // Set success message and clear any previous error
      this.successMessageDelete = 'Your account has been deleted successfully.';
      this.errorMessageDelete = '';

      // Log the user out and navigate to login page
      this.authService.logout();
      setTimeout(() => {
        this.router.navigate(['/login']); // Redirect after logout to avoid navigating during logout
      }, 500); // A small delay to ensure the logout completes before redirecting
    },
    (error) => {
      // Enhanced error handling
      console.error('Delete request failed:', error);  // Log detailed error information
      this.errorMessageDelete = `Failed to delete account: ${error.message || error.error}`;
    }
  );
}


}
