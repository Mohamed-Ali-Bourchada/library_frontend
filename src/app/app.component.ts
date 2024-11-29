import { Component, HostListener } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { BooksComponent } from './book/books/books.component'; // Ajout du composant BooksComponent
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,
    RouterOutlet,
    NavbarComponent
],  // Add RouterModule here

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Note the typo correction from 'styleUrl' to 'styleUrls'
})
export class AppComponent {
 @HostListener('window:scroll', [])
  onWindowScroll() {
    // Show the button when the user scrolls down 200px
    if (window.pageYOffset > 200) {
      document.getElementById('scrollToTopBtn')?.classList.add('show');
    } else {
      document.getElementById('scrollToTopBtn')?.classList.remove('show');
    }
  }

  // Scroll to the top when the button is clicked
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scroll
    });
  }

  title = 'library_frontend';
}
