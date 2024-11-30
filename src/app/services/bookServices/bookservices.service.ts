import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookservicesService {
  private apiUrl = 'http://localhost:8081/api/book/'; // Spring Boot backend URL

  constructor(private http:HttpClient) {

   }
   public GetAllBooks():Observable<Array<any>>
   {
    return this.http.get<Array<any>>(this.apiUrl)
   }
   createBook(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}createBook`, formData);
  }
}
