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
  updateBook(book: any): Observable<any> {
    const url = `${this.apiUrl}${book.id}/update`;
    return this.http.put(url, book);
  }
  updateCover(id: number, cover: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('cover', cover, cover.name);

    // Envoi de la requête PUT pour mettre à jour la couverture du livre
    return this.http.put(`${this.apiUrl}${id}/updateCover`, formData);
  }
  deleteBook(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}delete/${id}`)
  }


}
