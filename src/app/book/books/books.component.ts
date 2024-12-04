import { Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { BookservicesService } from '../../services/bookServices/bookservices.service';
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

}
