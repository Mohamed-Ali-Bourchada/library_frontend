import { Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { BookservicesService } from '../../services/bookServices/bookservices.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule,
    RouterModule
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule,RouterModule

  ],  // Add CommonModule here
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class BooksComponent {
  selectedCategory: string = 'all';
  BookDetails:any={
    title:"rich dad",
    author:"thomas",
    sujet:"educatif for rich",
   category:"educatif"
   }
   categories = [
    'Romantique',
    'Rrole',
    'Fantastique',
    'Historique',
    'Educatif',
    'Aventure',];

  books: Array<any> = [];
  
  constructor(private bookservicesService: BookservicesService,
    private router: Router,
    private authService: AuthService) {}
      



  constructor(private bookservicesService: BookservicesService) {}

  getAllBooks() {
    this.bookservicesService.GetAllBooks().subscribe({
      next: (data) => {
        this.books = data;
      }
    });
  }

  ngOnInit() {
    this.getAllBooks();
  }

  bookByCategorie(category: string){
    this.bookservicesService.getBooksByCategories(category).subscribe({
      next:(data)=>{
        this.books=data
      }
    })
  }
  filterBooks(category: string) {
    this.selectedCategory = category;
    if (category === 'all') {
      this.getAllBooks();
    } else {
      this.bookByCategorie(category);
    }
  }
  showBookDetails(book:any){
    this.BookDetails=book;
  }

  // Navigate to empreint page 
  onNavigateToEmprent(book:any): void {
    if (book) {
      this.router.navigate(['/emprenter'] ,{ state: { book } }); 
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "livre à emprenter n'est pas trouvé .",
      });
    }
  }
}
