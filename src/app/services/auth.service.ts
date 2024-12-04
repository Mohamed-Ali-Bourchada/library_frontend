import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string>(''); // Default value should be empty string
  private emailSubject = new BehaviorSubject<string>('');
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private passwordSubject = new BehaviorSubject<string>('');  // Store password if required

  // Expose BehaviorSubjects as Observables
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  email$ = this.emailSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();
  password$ = this.passwordSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkLoginStatus(); // Check if the user is logged in when the service is initialized
  }

  // Check if the user is already logged in (from localStorage)
  private checkLoginStatus() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.setUserDetails(parsedUser); // Automatically set user details if logged in
    }
  }

  // Set user details in BehaviorSubjects and localStorage
  setUserDetails(user: any) {

    // Update BehaviorSubjects with user details
    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(user.isAdmin);
    this.usernameSubject.next(user.username ||user.fullName|| '');  // Ensure fullName is set correctly
    this.emailSubject.next(user.email || '');
    this.passwordSubject.next(user.password || '');  // Use empty string if password doesn't exist
    this.userIdSubject.next(user.id);

    // Update user details in localStorage
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Login method using Basic Authentication
login(email: string, password: string, headers: HttpHeaders): Observable<any> {
  return this.http.post(`${environment.apiBaseUrl}/api/users/me`, {}, { headers, withCredentials: true })
}


  // Change password method
  changePassword(userId: number | null, currentPassword: string, newPassword: string): Observable<any> {
    const body = {
      currentPassword,
      newPassword,
      confirmNewPassword: newPassword // Confirmation matches the new password
    };

    return this.http.put(`${environment.apiBaseUrl}/api/users/${userId}/change-password`, body, {
      withCredentials: true // Automatically includes session cookies in the request
    });
  }

  // Logout and clear session data
  logout() {
    // Clear all the stored session data
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    this.usernameSubject.next('');
    this.emailSubject.next('');
    this.passwordSubject.next('');
    this.userIdSubject.next(null);
  }

  // Retrieve stored credentials (email and password) from localStorage
  getCredentialsFromLocalStorage(): { email: string; password: string } | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return {
        email: parsedUser.email,
        password: parsedUser.password || '' // Return password if exists
      };
    }
    return null; // Return null if no user found
  }

  // Delete user account (call API)
  deleteAccount(userId: number, headers: HttpHeaders): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/api/users/${userId}/delete`, { headers });
  }
}
