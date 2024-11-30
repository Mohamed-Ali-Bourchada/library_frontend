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
  private emailSubject = new BehaviorSubject<string>('');
  private userIdSubject = new BehaviorSubject<number | null>(null);
  private passwordSubject = new BehaviorSubject<string>('');  // Store password if required

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  email$ = this.emailSubject.asObservable();
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
      this.emailSubject.next(parsedUser.email);
      this.passwordSubject.next(parsedUser.password || '');  // Store password from localStorage
      this.userIdSubject.next(parsedUser.id || null);
    }
  }

  // Set user details in local storage and update the state
  setUserDetails(user: any) {
    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(user.isAdmin);
    this.usernameSubject.next(user.username);
    this.emailSubject.next(user.email);
    this.passwordSubject.next(user.password);  // Store password
    this.userIdSubject.next(user.id);

    // Store user details in localStorage (including email and password)
    localStorage.setItem('user', JSON.stringify(user));  // Store full user details including password
  }

  // Login method using Basic Authentication
  login(email: string, password: string, headers: HttpHeaders): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/api/users/me`, {}, { headers, withCredentials: true });
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

  // Logout and clear session
  logout() {
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    this.usernameSubject.next('');
    this.emailSubject.next('');
    this.passwordSubject.next('');
    this.userIdSubject.next(null); // Clear userId
  }

  // Retrieve username, email, and password from localStorage
  getCredentialsFromLocalStorage(): { email: string; password: string } | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return {
        email: parsedUser.email,
        password: parsedUser.password || ''
      };
    }
    return null; // Return null if no user found

  }
  
}
