import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string>('');
  private userIdSubject = new BehaviorSubject<number | null>(null); // Correct type for userId

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  userId$ = this.userIdSubject.asObservable(); // Correctly emits userId

  constructor(private http: HttpClient) {
    this.checkLoginStatus(); // Check login status when AuthService is initialized
  }

  checkLoginStatus() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (user && token) {
      const parsedUser = JSON.parse(user);
      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(parsedUser.isAdmin);
      this.usernameSubject.next(parsedUser.username);
      this.userIdSubject.next(parsedUser.id || null); // Emit userId
    }
  }

  login(email: string, password: string): Observable<any> {
    const base64Credentials = btoa(`${email}:${password}`);
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + base64Credentials
    });

    return this.http.get(`${environment.apiBaseUrl}/api/users/me`, { headers });
  }

  setUserDetails(user: any, token: string) {
    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(user.isAdmin);
    this.usernameSubject.next(user.username);
    this.userIdSubject.next(user.id); // Emit userId for subscribers

    localStorage.setItem('user', JSON.stringify(user)); // Store user details
    localStorage.setItem('authToken', token); // Store token
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    this.usernameSubject.next('');
    this.userIdSubject.next(null); // Clear userId
  }

  getLoggedInUserId(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.id || null; // Return userId if available
    }
    return null; // Return null if no user found
  }

  // Add the getToken method
  getToken(): string | null {
    return localStorage.getItem('authToken'); // Retrieve the token from localStorage
  }
}
