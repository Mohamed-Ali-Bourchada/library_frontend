import { Component } from '@angular/core';
import { CategorieComponent } from "../categorie/categorie/categorie.component";
import { BooksComponent } from "../book/books/books.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CategorieComponent, BooksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
