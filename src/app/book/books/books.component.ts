import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { BookservicesService } from '../../services/bookServices/bookservices.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule],  // Add CommonModule here
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent {
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
}
