import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';  // Import AuthService
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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
    private authService: AuthService,private cdRef: ChangeDetectorRef  // Inject AuthService
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

          if (response) {
            this.userInfoForm.patchValue({
              fullName: response.fullName || '',
              email: response.email || '',
              adresse: response.adresse|| '',
              telephone: response.telephone || '',
              dateNaiss: response.dateNaiss || '',
              is_admin:response.is_admin ||'',
            });
          }
        },
        (error) => {
          this.errorMessage = error?.message || 'Failed to load user information.';
        }
      );
    }
  }

updateLocalStorage(updatedUserData: any): void {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Update user data in localStorage
  const updatedUser = {
    ...currentUser,
    ...updatedUserData // Merge updated data with current user data
  };

  // Save the updated user data back to localStorage
  localStorage.setItem('user', JSON.stringify(updatedUser));
}
onUpdateUserInfo(): void {
  if (this.userInfoForm.invalid) {
    return;
  }

  const userData = this.userInfoForm.value;

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to update your information?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, update it!',
    cancelButtonText: 'No, cancel',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.http.put(`http://localhost:8081/api/users/${this.userId}/update`, userData).subscribe(
        (response) => {
          this.successMessage = 'User information updated successfully!';
          this.errorMessage = '';

          // Save the updated user data to localStorage

          // Update the AuthService with new user details
          this.authService.setUserDetails({
            ...response, // Assuming the response contains the updated user details
            ...userData // Merge updated userData into response (in case response doesn't include all fields)
          });
          this.updateLocalStorage(userData);

Swal.fire({
  title: 'Update Successful!',
  text: 'Your information has been updated successfully.',
  icon: 'success',
  toast: true, // Ensures it's a small, floating toast
  position: 'top-right', // Position the toast at the top-left corner
  showConfirmButton: false, // Hide confirm button for toast
  timer: 1500, // Duration of the toast in milliseconds
}).then(() => {
  this.getUserInfo();
});



          // Reset the form
          this.userInfoForm.reset();
        },
        (error) => {
          this.errorMessage = 'Failed to update user information: ' + (error.error || error.message);
          Swal.fire({
            title: 'Error!',
            text: `Failed to update user information: ${this.errorMessage}`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Cancelled',
        text: 'Your information has not been updated.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
  });
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
          // Success: Password updated successfully
          Swal.fire({
            title: 'Password Changed!',
            text: 'Your password has been updated successfully. Please log in again to continue.',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000, // Auto-close the alert after 3 seconds
            willClose: () => {
              // After the alert closes, log out the user
              this.authService.logout();
              // Redirect to the home page after the alert closes
              this.router.navigate(['/']);
            }
          });
        } else {
          // If the response status is not 200, it could be an unexpected error
          Swal.fire({
            title: 'Error!',
            text: 'An unexpected error occurred while changing the password.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (error) => {
        // If the current password is incorrect, show a specific error message
        if (error.status === 400 && error.error.message === 'Current password is incorrect') {
          Swal.fire({
            title: 'Error!',
            text: 'The current password you entered is incorrect.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else {
          // For other errors, show a generic error message
          Swal.fire({
            title: 'Error!',
            text: error.error?.message || 'Failed to change password.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
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
  // Check if userId is null
  if (!this.userId) {
    this.errorMessageDelete = 'User ID not found.';
    return;
  }

  // Show a confirmation alert before proceeding with the deletion
  Swal.fire({
    title: 'Are you sure?',
    text: 'This action is irreversible! Are you sure you want to delete your account?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      const headers = this.generateBasicAuthHeader();  // Ensure this method exists in your AuthService

      // Only call deleteAccount if userId is valid (not null)
      if (this.userId !== null) {
        this.authService.deleteAccount(this.userId, headers).subscribe(
          (response: any) => {
            // Set success message and clear any previous error
            this.successMessageDelete = response.message;  // Extract message from response
            this.errorMessageDelete = '';  // Clear any previous error

            // Show success alert
            Swal.fire({
              title: 'Account Deleted',
              text: 'Your account has been deleted successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
              timer: 3000 // Auto-close the alert after 3 seconds
            }).then(() => {
              // Log the user out
              this.authService.logout();
              this.router.navigate(['/']);


            });
          },
          (error) => {
            // Enhanced error handling
            console.error('Delete request failed:', error);  // Log detailed error information
            this.errorMessageDelete = `Failed to delete account: ${error.error?.message || error.message || 'Unknown error'}`;
            // Show error alert
            Swal.fire({
              title: 'Error',
              text: `Failed to delete account: ${this.errorMessageDelete}`,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      } else {
        this.errorMessageDelete = 'Invalid user ID.';
      }
    } else {
      // If the user cancels the deletion
      Swal.fire({
        title: 'Cancelled',
        text: 'Your account has not been deleted.',
        icon: 'info',
        confirmButtonText: 'OK'
      });
    }
  });
}}
