import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string>('');
  private emailSubject = new BehaviorSubject<string>('');  // Added for email tracking
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private passwordSubject = new BehaviorSubject<string>('');  // Store password if required (not recommended for security)

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  email$ = this.emailSubject.asObservable();  // Observable to track email
  userId$ = this.userIdSubject.asObservable();
  password$ = this.passwordSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkLoginStatus(); // Check login status when AuthService is initialized
  }

  // Check if the user is already logged in (session-based)
  checkLoginStatus() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(parsedUser.isAdmin);
      this.usernameSubject.next(parsedUser.username);
      this.emailSubject.next(parsedUser.email);  // Retrieve and store email
      // Avoid storing the password in state, as this poses a security risk
      this.passwordSubject.next(parsedUser.password || '');  // Retrieve and store password only if absolutely necessary
      this.userIdSubject.next(parsedUser.id || null);
    }
  }

  // Set user details in local storage and update the state
  setUserDetails(user: any) {
    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(user.isAdmin);
    this.usernameSubject.next(user.username);
    this.emailSubject.next(user.email);  // Save email
    // Avoid saving password in BehaviorSubject or localStorage unless absolutely necessary
    this.passwordSubject.next(user.password || '');  // Save password only if needed
    this.userIdSubject.next(user.id);

    // Store user details in localStorage (including email but avoid storing sensitive information like passwords)
    localStorage.setItem('user', JSON.stringify(user));  // Store full user details in localStorage
  }

  // Login method using Basic Authentication (you can pass headers directly in the component)
  login(email: string, password: string, headers: HttpHeaders): Observable<any> {
    // Make sure to correctly format the URL using template literals
    return this.http.post(`${environment.apiBaseUrl}/api/users/me`, {}, { headers, withCredentials: true });
  }

  // Change password method
  changePassword(userId: number | null, currentPassword: string, newPassword: string): Observable<any> {
    const body = {
      currentPassword,
      newPassword,
      confirmNewPassword: newPassword // Confirmation matches the new password
    };

    // Correct URL format with template literals
    return this.http.put(`${environment.apiBaseUrl}/api/users/${userId}/change-password`, body, {
      withCredentials: true // Automatically includes session cookies in the request
    });
  }

  // Logout and clear session
  logout() {
    // Clear session and remove user data from localStorage
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    this.usernameSubject.next('');
    this.emailSubject.next('');  // Clear email
    this.passwordSubject.next('');
    this.userIdSubject.next(null); // Clear userId
  }

  // Retrieve username, email, and password from localStorage
  getCredentialsFromLocalStorage(): { email: string; password: string } | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return {
        email: parsedUser.email,  // Return email
        password: parsedUser.password || ''  // Return password if available (but ideally not store this in localStorage)
      };
    }
    return null; // Return null if no user found
  }
}
