import { Component } from '@angular/core';
import { EmpruntServicesService } from '../../../services/empruntService/emprunt-services.service';
import Swal from 'sweetalert2';
import {Modal} from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-emprint-admin',
  standalone:true,
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './emprint-admin.component.html',
  styleUrl: './emprint-admin.component.css'
})
export class EmprintAdminComponent {
  emprints :Array<any>=[];
  page: number = 1;  // Current page
  itemsPerPage: number = 10; 
  searchTerm: string = '';
  filteredemprint: any[] = [];
  constructor(
    private emprunteService:EmpruntServicesService,

  ) {}
  ngOnInit(): void {
    this.getAllEmprint();
  }
  getAllEmprint(){
    this.emprunteService.getAllEmprint().subscribe({
      next:(data)=>{
        this.emprints=data;
      }
    })
  }
  unavailableEmprient: any = null; // Stocker le livre indisponible

  isDateRetourBeforeNow(dateRetourPrevu: string | null): boolean {
    if (!dateRetourPrevu) return true; // Par défaut, pas d'erreur si aucune date fournie
    const today = new Date();
    const retourDate = new Date(dateRetourPrevu);
    return retourDate >= today; // Retourne true si la date de retour est dans le futur
  }

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
