import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { HttpClient } from '@angular/common/http'; // Add HttpClient for API calls
import { Router } from '@angular/router'; // Add Router to redirect after successful signup

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Add CommonModule here
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  errorMessage: string = ''; // To display error message

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,  // Inject HttpClient for sending POST request
    private router: Router     // Inject Router to redirect after successful signup
  ) {
    // Form group with custom validator for password matching
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      adresse: ['', [Validators.required]], // New Address field
      dateNaiss: ['', [Validators.required]], // New Date of Birth field
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  // Submit the sign-up form
  onSignUpSubmit() {
  if (this.signUpForm.valid) {
    const user = this.signUpForm.value;

    // Make API call to register the user
    this.http.post('http://localhost:8081/api/users/register', user).subscribe(
      (response) => {
        console.log('Sign Up successful', response);
        // Redirect to login page or any other page after successful sign up
        this.router.navigate(['/login']);
      },
      (error) => {
        // Log the full error object to inspect its structure
        console.error('Full error object:', error);

        // Check if the error status is 400 (Bad Request)
        if (error.status === 400) {
          // Check if the error message is 'Email is already registered.'
            this.errorMessage = 'Email already exists. Please use a different email address.';
          } else {
            // In case the error message isn't specific to email, use the fallback
            this.errorMessage = 'Sign Up failed: ' + (error.error.message || error.statusText);
          }
        }

      
    );
  } else {
    this.errorMessage = 'Form is invalid!';
  }
}


  // Getter for easy access to form controls in the template
  get f() {
    return this.signUpForm.controls;
  }

  get passwordMatchError() {
    return this.signUpForm.hasError('mismatch') && this.signUpForm.get('confirmPassword')?.touched;
  }
}
