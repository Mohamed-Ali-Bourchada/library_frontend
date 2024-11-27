import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/env'; // Import environment for API URL

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    // Encode email and password in base64 for Basic Authentication
    const base64Credentials = btoa(`${email}:${password}`);

    // Set the Basic Authentication header
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + base64Credentials
    });

    // Send a GET request to the backend to authenticate the user
    return this.http.get(`${environment.apiBaseUrl}/api/users/me`, { headers });
  }
}
