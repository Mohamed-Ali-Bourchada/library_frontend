import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BookservicesService } from '../../services/bookServices/bookservices.service';

import * as bootstrap from 'bootstrap';

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
  // delet book
  deletBook(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          console.log('Livre supprimé avec succès');
          this.getAllBooks(); // Actualiser la liste des livres
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du livre', err);
        }
      });
    }}
  



      // Créer une copie du livre sélectionné pour ne pas modifier les données originales
  openModal(book: any) {
    this.selectedBook = { ...book };  
  }

  // Fonction pour sauvegarder les modifications
  saveChanges() {
    this.bookService.updateBook(this.selectedBook).subscribe({
      next: (response) => {
        console.log('Livre mis à jour avec succès :', response);
        this.getAllBooks(); // Actualiser la liste des livres
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du livre :', error);
        // Si une erreur survient, empêcher la fermeture du modal
        const modalButton = document.querySelector('button[data-bs-dismiss="modal"]');
        if (modalButton) {
          modalButton.removeAttribute('data-bs-dismiss');
        }
      },
    });
  }

  onCoverFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.updateCover(file);
    }
  }

  // Fonction pour mettre à jour la couverture
  // ne donctionne pas correctement 
  updateCover(cover: File): void {
    const bookId = this.selectedBook.id; // Id du livre à mettre à jour
    this.bookService.updateCover(bookId, cover).subscribe({
      next: (response) => {
        console.log('Couverture mise à jour avec succès !', response);
        // Effectuer les actions nécessaires après la mise à jour, comme fermer le modal, etc.
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de la couverture', error);
        // Gérer l'erreur si nécessaire
      }
    });
  }

 
  openCoverModal(book: any) {
    this.selectedBook = { ...book }; 
    const modalElement = document.getElementById('coverModal');
    if (modalElement) {
      // Initialise et affiche le modal avec Bootstrap
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }
  
}
