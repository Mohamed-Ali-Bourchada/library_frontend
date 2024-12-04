import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EmpreuntRequestDTO {
  book: { id: number };
  user: { id: number };
  dateRoutourPrevu: string;
} 
@Injectable({
  providedIn: 'root'
})
export class EmpruntServicesService {
  private apiUrl = 'http://localhost:8081/api/empreunt/';

  constructor(private http:HttpClient) { }

  public getEmpruntesForBook(bookId:number):Observable<any>{
    const url=`${this.apiUrl}getBook/${bookId}`;
    return this.http.get(url);
  }
  public setBookRetour(empruentId:number):Observable<any>{
    const url=`${this.apiUrl}${empruentId}/retour`;
    return this.http.put(url,{})
  }
  public getHistorique(userId:number):Observable<Array<any>>{
    const url=`${this.apiUrl}getHistorique/${userId}`;
    return this.http.get<Array<any>>(url);
  }
  
  addEmprunt(empreuntRequestDTO: EmpreuntRequestDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}add`, empreuntRequestDTO, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
}}
