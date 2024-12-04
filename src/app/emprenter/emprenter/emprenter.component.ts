import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
  import { EmpruntServicesService ,EmpreuntRequestDTO} from '../../services/empruntService/emprunt-services.service';
  import { CommonModule } from '@angular/common';
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
  book: any; // Livre sélectionné
  user: any; // Utilisateur connecté 
  dateRoutourPrevu: string = ''; // Date sélectionnée

  constructor(private empruntService: EmpruntServicesService, private router: Router) {}

  ngOnInit(): void {
    this.book = history.state.book;

    // Récupérer l'utilisateur depuis localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Connecter dabords .",
      });
    }
  }

  confirmEmprunt() {
    if (!this.dateRoutourPrevu) {
      Swal.fire({
        icon: 'warning',
        title: 'date invalide',
        text: "Please select a return date.",
      });
      return;
    }

    const empreuntRequestDTO: EmpreuntRequestDTO = {
      book: { id: this.book.id },
      user: { id: this.user.id },
      dateRoutourPrevu: this.dateRoutourPrevu,
    };

    this.empruntService.addEmprunt(empreuntRequestDTO).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: response.message || 'Livre emprenté',
          text: 'Le livre a été emprenté avec succès.',
          showConfirmButton: true,
        }).then(()=>{
          this.router.navigate(['/home']); // Rediriger après succès
        })
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Error: ${error.error || 'Failed to borrow book.'}`,
        });
      },
    });
  }
}
