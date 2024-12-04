import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
  import { EmpruntServicesService ,EmpreuntRequestDTO} from '../../services/empruntService/emprunt-services.service';
  import { CommonModule, formatDate } from '@angular/common';
  import { FormsModule } from '@angular/forms'; // Import FormsModule
  import Swal from 'sweetalert2';

@Component({
  selector: 'app-emprenter',
  standalone:true,
  imports:[FormsModule],
  templateUrl: './emprenter.component.html',
  styleUrls: ['./emprenter.component.css'],
})
export class EmprenterComponent implements OnInit {
  book: any; // Selected book
  user: any; // Logged-in user
  dateRoutourPrevu: string = ''; // Selected date
  minReturnDate: string = ''; // Minimum return date
  maxReturnDate: string = ''; // Maximum return date

  constructor(private empruntService: EmpruntServicesService, private router: Router) {}

  ngOnInit(): void {
    this.book = history.state.book;

    // Retrieve user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Connectez-vous d'abord.",
      });
      return;
    }

    // Calculate min and max return dates
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 14); // 2 weeks from today

    // Format dates to `YYYY-MM-DD`
    this.minReturnDate = formatDate(today, 'yyyy-MM-dd', 'en');
    this.maxReturnDate = formatDate(maxDate, 'yyyy-MM-dd', 'en');
  }

  confirmEmprunt() {
    if (!this.dateRoutourPrevu) {
      Swal.fire({
        icon: 'warning',
        title: 'Date invalide',
        text: "Veuillez sélectionner une date de retour.",
      });
      return;
    }

    // Validate selected return date
    const selectedDate = new Date(this.dateRoutourPrevu);
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 14);

    if (selectedDate < today || selectedDate > maxDate) {
      Swal.fire({
        icon: 'warning',
        title: 'Date invalide',
        text: "La date de retour doit être comprise entre aujourd'hui et 2 semaines.",
      });
      return;
    }

    // Prepare the request DTO
    const empreuntRequestDTO: EmpreuntRequestDTO = {
      book: { id: this.book.id },
      user: { id: this.user.id },
      dateRoutourPrevu: this.dateRoutourPrevu,
    };

    // Call the service to create the emprunt
    this.empruntService.addEmprunt(empreuntRequestDTO).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: response.message || 'Livre emprunté',
          text: 'Le livre a été emprunté avec succès.',
          showConfirmButton: true,
        }).then(() => {
          this.router.navigate(['/home']); // Redirect after success
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Erreur : ${error.error || "Impossible d'emprunter le livre."}`,
        });
      },
    });
  }
}
