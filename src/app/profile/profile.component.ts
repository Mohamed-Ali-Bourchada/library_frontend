import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],  // Add your necessary imports for this component
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  userForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  userId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      fullName: [''],
      email: [''],
      password: [''],
      confirmPassword: [''],
      adresse: [''],
      dateNaiss: [''],
      phoneNumber: ['']
    });
  }

ngOnInit(): void {
  // Get the userId from the route parameters
  this.route.paramMap.subscribe(params => {
    const userIdFromRoute = Number(params.get('id'));  // Capture 'id' from the URL
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
            this.userForm.patchValue({
              fullName: response.fullName,
              email: response.email,
              adresse: response.adresse,
              dateNaiss: response.dateNaiss,
              phoneNumber: response.telephone
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


  onSubmit(): void {
    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    this.isLoading = true;
    const updatedUser = { ...this.userForm.value, telephone: this.userForm.value.phoneNumber };

    this.http.put(`http://localhost:8081/api/users/${this.userId}/update`, updatedUser)
      .subscribe(
        (response) => {
          this.successMessage = 'Profile updated successfully!';
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/profile'], { queryParams: { id: this.userId } });
          }, 1500);
        },
        (error) => {
          this.errorMessage = error?.message || 'Failed to update profile.';
          this.isLoading = false;
        }
      );
  }
}
