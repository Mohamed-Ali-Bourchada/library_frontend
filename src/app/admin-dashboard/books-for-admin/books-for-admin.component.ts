import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BookservicesService } from '../../services/bookServices/bookservices.service';
import { EmpruntServicesService } from '../../services/empruntService/emprunt-services.service';
import * as bootstrap from 'bootstrap';
import {Modal} from 'bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-books-for-admin',
  standalone:true,
  imports: [CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './books-for-admin.component.html',
  styleUrl: './books-for-admin.component.css'
})
export class BooksForAdminComponent implements OnInit{
  books :Array<any>=[];
  page: number = 1;  // Current page
  itemsPerPage: number = 10;
  searchTerm: string = '';
  filteredBooks: any[] = [];

  selectedBook: any = {};  // Pour stocker les informations du livre sélectionné

  categories = [
    'Romantique',
    'Drole',
    'Fantastique',
    'Historique',
    'Aventure',
    'Educative'];

  constructor(
    private bookService:BookservicesService,
    private emprunteService:EmpruntServicesService,

  ) {}
  ngOnInit(): void {
    this.getAllBooks();
  }

  validationErrors: any = {}; // To store validation errors
  onSearch(): void {
    if (this.searchTerm) {
      this.filteredBooks = this.books.filter((book) => {
        return (
          book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    } else {
      this.filteredBooks = [...this.books];  // Reset to all users if searchTerm is empty
    }
    this.page = 1;  // Reset pagination to the first page when search is done
  }
  getAllBooks() {
    this.bookService.GetAllBooks().subscribe({
      next:(data)=>{
        this.books=data
        this.filteredBooks = data;
      },
      error: (err) => {
        console.error("Erreur lors de l'importer des livre", err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Erreur lors de l'importer des livre.",
        });
      }
    })
  }
  titreAchercher:string='';
  searchBooks(){
    if(this.titreAchercher){
      this.bookService.getBookByTitle(this.titreAchercher).subscribe({
        next:(data)=>{
          this.books=data;
          this.titreAchercher=""
        },
        error: (err) => {
          console.error('Erreur lors de la recherche du livre', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la recherche du livre.',
          });
        }
      })
    }
  }
  getBookByState(stateBooks: string) {
    this.bookService.getBooksByState(stateBooks).subscribe({
      next: (data) => {
        this.books = data;
        this.filteredBooks = data;
        this.searchTerm=""
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la recherche du livre.',
        });      }
    });
  }

  // Open modal and create a copy of the selected book
  openModal(book: any) {
    this.selectedBook = { ...book };
    this.validationErrors = {}; // Reset validation errors
  }

  // Validate form fields
  validateBookFields(): boolean {
    this.validationErrors = {}; // Reset validation errors

    if (!this.selectedBook.title || this.selectedBook.title.trim() === '') {
      this.validationErrors.title = 'Le titre est requis.';
    }
    if (!this.selectedBook.author || this.selectedBook.author.trim() === '') {
      this.validationErrors.author = 'L\'auteur est requis.';
    }
    if (!this.selectedBook.category || this.selectedBook.category.trim() === '') {
      this.validationErrors.category = 'La catégorie est requise.';
    }
    if (!this.selectedBook.sujet || this.selectedBook.sujet.trim() === '') {
      this.validationErrors.sujet = 'Le sujet est requis.';
    }

    // If there are no validation errors, return true
    return Object.keys(this.validationErrors).length === 0;
  }

  // Save changes after validation
saveChanges() {
  if (!this.validateBookFields()) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation échouée',
      text: 'Veuillez corriger les erreurs de validation avant de soumettre.',
      confirmButtonText: 'OK'
    });
    return;
  }

  this.bookService.updateBook(this.selectedBook).subscribe({
    next: (response) => {
      // Handle successful response
      console.log('Réponse du backend :', response);
      const modalElement = document.getElementById('exampleModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }

      Swal.fire({
        icon: 'success',
        title: 'Livre mis à jour avec succès',
        text: 'Les informations du livre ont été mises à jour.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.getAllBooks();
      });
    },
    error: (error) => {
      if (error.status === 200) {
        // Treat status 200 as success if backend doesn't return valid JSON
        console.warn('Réponse non standard, mais mise à jour effectuée.');
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
        }

        Swal.fire({
          icon: 'success',
          title: 'Livre mis à jour avec succès',
          text: 'Les informations du livre ont été mises à jour, bien que la réponse du serveur ne soit pas standard.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.getAllBooks();

        });
      } else {
        // Handle genuine errors
        console.error('Erreur lors de la mise à jour du livre :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur lors de la mise à jour',
          text: error.error || 'Une erreur est survenue lors de la mise à jour du livre. Veuillez réessayer.',
          confirmButtonText: 'OK'
        });
      }
    }
  });
}

selectAll: boolean = false;

toggleSelectAll() {
  for (const book of this.books) {
    book.selected = this.selectAll;
  }
}
deleteSelectedBooks() {
  const booksToDelete = this.books.filter(book => book.selected).map(book => book.id); // Only send the IDs

  if (booksToDelete.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Aucune sélection',
      text: 'Veuillez sélectionner au moins un livre à supprimer.',
      confirmButtonText: 'OK'
    });
    return;
  }

  Swal.fire({
    icon: 'warning',
    title: 'Êtes-vous sûr ?',
    text: 'Les livres sélectionnés seront supprimés.',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then(result => {
    if (result.isConfirmed) {
      this.bookService.deleteBooks(booksToDelete).subscribe({
        next: (response) => {
          // Check if the response indicates success
          if (response && response.success) { // Assuming 'success' is returned in the response
            Swal.fire({
              icon: 'success',
              title: 'Suppression réussie',
              text: response.message, // Assuming the success message is in 'message'
              timer: 2000,
              showConfirmButton: false
            });
            this.ngOnInit(); // Refresh the book list
            this.getAllBooks(); // Refresh the book list after deletion
          } else {
            // In case the response indicates failure
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression des livres.',
            });
          }
        },
        error: (err) => {
          // Handle error response from backend
          const errorMessage = err?.error?.message || 'Une erreur est survenue lors de la suppression des livres.';
          console.error('Erreur lors de la suppression des livres', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage, // Show the error message from backend
          });
        }
      });
    }
  });
}

fileSelected!: string | ArrayBuffer | null;
 cover!: File ;
onCoverFileSelected(event: any): void {
   this.cover= event.target.files[0];
  if (this.cover) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.fileSelected = e.target?.result ?? null;
    };
    reader.readAsDataURL(this.cover); // Lit le fichier comme une URL de données (base64)
  }
}


  // Fonction pour mettre à jour la couverture
  // ne donctionne pas correctement
  updateCover(): void {
    const bookId = this.selectedBook.id; // Id du livre à mettre à jour
    this.bookService.updateCover(bookId, this.cover).subscribe({
      next: (response) => {
    // Handle successful response
    console.log('Réponse du backend :', response);
    const modalElement = document.getElementById('coverModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }

    Swal.fire({
      icon: 'success',
      title: 'cover mis à jour avec succès',
      text: 'cover a été changé.',
      confirmButtonText: 'OK'
    }).then(() => {
      this.getAllBooks();
    });
  },
  error: (error) => {
    if (error.status === 200) {
      // Treat status 200 as success if backend doesn't return valid JSON
      console.warn('Réponse non standard, mais mise à jour effectuée.');
      const modalElement = document.getElementById('coverModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }

      Swal.fire({
        icon: 'success',
        title: 'cover mis à jour avec succès',
        text: 'cover été mises à jour, bien que la réponse du serveur ne soit pas standard.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.getAllBooks();

      });
    } else {
      // Handle genuine errors
      console.error('Erreur lors de la mise à jour du cover :', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur lors de la mise à jour',
        text: error.error || 'Une erreur est survenue lors de la mise à jour du cover. Veuillez réessayer.',
        confirmButtonText: 'OK'
      });
    }
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



  // Fonction pour comparer la date actuelle avec la date de retour prévue
  isDateRetourBeforeNow(dateRetourPrevu: string | null): boolean {
    if (!dateRetourPrevu) return true; // Par défaut, pas d'erreur si aucune date fournie
    const today = new Date();
    const retourDate = new Date(dateRetourPrevu);
    return retourDate >= today; // Retourne true si la date de retour est dans le futur
  }


}
