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

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkLoginStatus();  // Check login status when AuthService is initialized
  }

  // Method to check if the user is logged in based on localStorage
  checkLoginStatus() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    if (user && token) {
      const parsedUser = JSON.parse(user);
      this.isLoggedInSubject.next(true);
      this.isAdminSubject.next(parsedUser.isAdmin);
      this.usernameSubject.next(parsedUser.username);
    }
  }

  login(email: string, password: string): Observable<any> {
    const base64Credentials = btoa(`${email}:${password}`);
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + base64Credentials
    });

    return this.http.get(`${environment.apiBaseUrl}/api/users/me`, { headers });
  }

  // Update state after successful login
  setUserDetails(user: any, token: string) {
    this.isLoggedInSubject.next(true);
    this.isAdminSubject.next(user.isAdmin);
    this.usernameSubject.next(user.username);

    // Store user details and token in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    this.usernameSubject.next('');
  }

getLoggedInUserId(): number | null {
  const user = localStorage.getItem('user');
  if (user) {
    const parsedUser = JSON.parse(user);
    console.log(parsedUser.id);
    return parsedUser.id ? parsedUser.id : null;  // Ensure 'id' exists in the stored user object
  }
  return null;
}


}
