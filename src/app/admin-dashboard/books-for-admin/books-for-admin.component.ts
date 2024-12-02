import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BookservicesService } from '../../services/bookServices/bookservices.service';
import { EmpruntServicesService } from '../../services/empruntService/emprunt-services.service';
import * as bootstrap from 'bootstrap';
import {Modal} from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
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
    private emprunteService:EmpruntServicesService,

  ) {}

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
deleteBook(id: number): void {
  // Show SweetAlert confirmation dialog
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer ce livre ?',
    text: "Cette action est irréversible.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // If user confirms, call the deleteBook service
      this.bookService.deleteBook(id).subscribe({
        next: (response) => {
          // Handle success response
          if (response && response.message) {
            Swal.fire({
              icon: 'success',
              title: response.message,
              text: 'Le livre a été supprimé de la liste.',
              timer: 2000,
              showConfirmButton: false
            });
            this.getAllBooks(); // Refresh the book list
          }
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du livre', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la suppression du livre.',
          });
        }
      });
    }
  });
}





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
  unavailableBook: any = null; // Stocker le livre indisponible


  openUnavailableModal(book: any) {
    console.log('Book reçu:', book);
    console.log('Book reçu:', book.id);

    if (book.stateBook === 'indisponible') {
       this.emprunteService.getEmpruntesForBook(book.id).subscribe({
        //this.http.get('http://localhost:8081/api/empreunt/getBook/3').subscribe({
        next:(response)=>{
          this.unavailableBook = response[0];
          console.log(" unavailableBook:",this.unavailableBook);
          console.log(" titre:",response[0].user.fullName);

        },
        error:(error)=>{
          console.error(error);

        }
      })

       // Stocker les détails du livre
    }
  }
  // Fonction pour comparer la date actuelle avec la date de retour prévue
  isDateRetourBeforeNow(dateRetourPrevu: string | null): boolean {
    if (!dateRetourPrevu) return true; // Par défaut, pas d'erreur si aucune date fournie
    const today = new Date();
    const retourDate = new Date(dateRetourPrevu);
    return retourDate >= today; // Retourne true si la date de retour est dans le futur
  }
  setRetourBook(empruentId:number):void
  {
    this.emprunteService.setBookRetour(empruentId).subscribe({
      next:()=>{
        const modalElement = document.getElementById('unavailableModal');
        if (modalElement) {
          const modalInstance = new Modal(modalElement); // Créer une instance du modal
          modalInstance.hide(); // Fermer le modal
        }

        console.log("test");
        },


      error:(error)=>{
        console.error(error);

      }
    })

  }

}
