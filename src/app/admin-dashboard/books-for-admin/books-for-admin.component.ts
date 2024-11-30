import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BookservicesService } from '../../services/bookServices/bookservices.service';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-books-for-admin',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './books-for-admin.component.html',
  styleUrl: './books-for-admin.component.css'
})
export class BooksForAdminComponent implements OnInit{
  books :Array<any>=[];
  

  selectedBook: any = {};  // Pour stocker les informations du livre sélectionné

  categories = [
    'romantique',
    'drole',
    'fantastique',
    'historique',
    'educatif',
    'aventure',
    'educative']; 
  constructor(
    private bookService:BookservicesService,
    private fb:FormBuilder
  ) {}
  // get f() {
  //   return this.bookForUpdate.controls;
  // }
  getAllBooks(){
    this.bookService.GetAllBooks().subscribe({
      next:(data)=>{
        this.books=data
      }
    })
  }
  ngOnInit(): void {
    this.getAllBooks();
  }
  openModal(book: any) {
    this.selectedBook = { ...book };  // Créer une copie du livre sélectionné pour ne pas modifier les données originales
  }

  // Fonction pour sauvegarder les modifications
  saveChanges() {
    // Ici vous pouvez mettre la logique pour enregistrer les modifications
    console.log('Les changements ont été enregistrés:', this.selectedBook);
    // Fermer le modal si nécessaire
    // Vous pouvez aussi mettre à jour la liste des livres si vous modifiez un livre
  }

  
}
