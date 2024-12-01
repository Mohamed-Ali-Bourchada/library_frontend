import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      adresse: ['', [Validators.required]],
      dateNaiss: ['', [Validators.required]],
      telephone: ['', [Validators.required, Validators.pattern(/^\+\d{1,15}$/)]],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  onSignUpSubmit() {
    if (this.signUpForm.valid) {
      const user = this.signUpForm.value;

      console.log('User object being sent to API:', user);

      this.http.post('http://localhost:8081/api/users/register', user, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe(
        (response) => {
          console.log('Sign Up successful', response);

          // Trigger SweetAlert for success
          Swal.fire({
            title: 'Sign Up Successful!',
            text: 'Your account has been created successfully. You will be redirected to the login page.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/login']); // Redirect to login page
          });
        },
        (error) => {
          console.error('Full error object:', error);

          // Trigger SweetAlert for error
          if (error.status === 400) {
            Swal.fire({
              title: 'Sign Up Failed!',
              text: 'Email already exists. Please use a different email address.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Sign Up Failed!',
              text: 'An error occurred: ' + (error.error.message || error.statusText),
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      );
    } else {
      // Trigger SweetAlert for invalid form
      Swal.fire({
        title: 'Invalid Form',
        text: 'Please fill out all required fields correctly.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  get f() {
    return this.signUpForm.controls;
  }

  get passwordMatchError() {
    return this.signUpForm.hasError('mismatch') && this.signUpForm.get('confirmPassword')?.touched;
  }
}
