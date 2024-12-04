import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookservicesService } from '../services/bookServices/bookservices.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';  // <-- Add this for ngModel
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-books',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, FormsModule,RouterModule],
  templateUrl: './all-books.component.html',
  styleUrls: ['./all-books.component.css']
})
export class AllBooksComponent implements OnInit {
  books: any[] = [];
  paginatedBooks: any[] = [];
  BookDetails: any = {}; // Store the selected book details
  currentPage: number = 1;
  itemsPerPage: number = 8;
  searchTerm: string = '';  // Search term for filtering books by name
  filteredBooks: any[] = [];  // Define filteredBooks as a separate property

  constructor(private bookservices: BookservicesService,private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllBooks();
  }

  getAllBooks(): void {
    this.bookservices.GetAllBooks().subscribe({
      next: (data: any[]) => {
        this.books = data;
        this.filteredBooks = data;  // Initialize filteredBooks with all books
        this.applySearchAndPagination(); // Apply search and pagination together
      },
      error: (err: any) => {
        console.error('Error fetching books:', err);
      }
    });
  }

  getBookByState(stateBooks: string): void {
    this.bookservices.getBooksByState(stateBooks).subscribe({
      next: (data: any[]) => {
        this.books = data;
        this.filteredBooks = data; // Now you can assign filteredBooks directly
        this.searchTerm = ''; // Clear search term when switching states
        this.applySearchAndPagination(); // Apply search and pagination
      },
      error: (err: any) => {
        console.error('Error fetching books by state:', err);
      }
    });
  }

  // Method for searching books by name and applying pagination
  applySearchAndPagination(): void {
    // Apply search filter to books
    const filteredBySearch = this.books.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Update filteredBooks with the search result
    this.filteredBooks = filteredBySearch;

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedBooks = filteredBySearch.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applySearchAndPagination(); // Reapply search and pagination when page changes
  }

  showBookDetails(book: any): void {
    this.BookDetails = book; // Set the selected book details
  }
  onNavigateToEmprent(book: any): void {
    if (book) {
      this.router.navigate(['/emprenter'], { state: { book } });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Le livre à emprunter n'est pas trouvé.",
      });
    }
  }
}
