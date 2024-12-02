import { Component, OnInit } from '@angular/core';
import { EmpruntServicesService } from '../../services/empruntService/emprunt-services.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-historique',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent implements OnInit {
  historiques:Array<any>=[];
  userId: number | undefined;

  constructor(private emprunteService:EmpruntServicesService,
              private route: ActivatedRoute){}

  ngOnInit(): void {
    const user =localStorage.getItem('user')
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id;
      this.getAll();
    }
  }
  getAll(): void {
    if (this.userId) {
      this.emprunteService.getHistorique(this.userId).subscribe({
        next: (data) => {
          this.historiques = data;
          console.log(this.historiques);
          console.log(this.historiques[0].book.title);
          
          
        },
        error: (error) => {
          console.error('Erreur lors de la récupération de l\'historique:', error);
        }
      });
    } else {
      console.error('Impossible de récupérer les données sans user.');
    }
  }
  
  
}
