import { Component } from '@angular/core';
import { EmpruntServicesService } from '../../../services/empruntService/emprunt-services.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emprint-admin',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './emprint-admin.component.html',
  styleUrls: ['./emprint-admin.component.css']
})
export class EmprintAdminComponent {
  emprints: Array<any> = []; // Array of all borrow records
  filteredEmprints: Array<any> = []; // Array to hold filtered records
  page: number = 1; // Current page for pagination
  itemsPerPage: number = 10; // Items per page
  searchTerm: string = ''; // Search term to filter the list
  unavailableEmprient: any = null; // Stores the selected unavailable record for modal

  constructor(private emprunteService: EmpruntServicesService) { }

  ngOnInit(): void {
    this.getAllEmprint();
  }

  // Fetch all borrow records
  getAllEmprint(): void {
    this.emprunteService.getAllEmprint().subscribe({
      next: (data) => {
        this.emprints = data.map(emprint => {
          emprint.book.stateBook = emprint.book.stateBook || 'indisponible'; // Default to 'indisponible' if undefined
          return emprint;
        });
        this.filteredEmprints = [...this.emprints]; // Initially, all records are displayed
      },
      error: (error) => {
        console.error('Error fetching borrow records:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de récupérer les données. Veuillez réessayer plus tard.'
        });
      }
    });
  }

  // Method to filter the borrow records based on the search term
  filterEmprints(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmprints = this.emprints.filter(emprint =>
      emprint?.user?.fullName?.toLowerCase().includes(term) ||
      emprint?.book?.title?.toLowerCase().includes(term) ||
      emprint?.book?.author?.toLowerCase().includes(term) ||
      emprint?.dateEmprunt?.toLowerCase().includes(term) ||
      emprint?.dateRoutourPrevu?.toLowerCase().includes(term) ||
      (emprint?.dateRoutourEffective ? emprint?.dateRoutourEffective.toLowerCase().includes(term) : false)
    );
    this.page = 1; // Reset pagination to first page when filtering
  }
  filterNotReturnedBooks() {
    this.filteredEmprints = this.emprints.filter(emprint => !emprint?.dateRoutourEffective);
  }
   showAllBooks() {
    this.filteredEmprints = [...this.emprints]; // Reset to show all books
  }
  // Check if return date is before today
  isDateRetourBeforeNow(dateRetourPrevu: string | null): boolean {
    if (!dateRetourPrevu) return true;
    const today = new Date();
    const retourDate = new Date(dateRetourPrevu);
    return retourDate >= today; // True if the date is in the future
  }

  // Open modal for unavailable books

  openUnavailableModal(emprent: any) {
    if (emprent?.book?.stateBook === 'indisponible') {
      this.emprunteService.getEmprintById(emprent?.id).subscribe({
        next: (response) => {
          this.unavailableEmprient =response

          // Ensure modal is in the DOM
          const modalElement = document.getElementById('unavailableModal');
          if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
          } else {
            console.error('Modal element not found!');
          }
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors au niveau de livre',
            text: error.error || 'Une erreur est survenue lors de l ouverture de livre. Veuillez réessayer.',
            confirmButtonText: 'OK'
          });
        }
      });
    }
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
      },


      error:(error)=>{
        console.error(error);

      }
    })

  }
}

