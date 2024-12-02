import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:8081/api/users/getAllUsers';

  constructor(private http:HttpClient) { }
  getAllUsers():Observable<Array<any>>{
    return this.http.get<Array<any>>(this.apiUrl);
  }
}
