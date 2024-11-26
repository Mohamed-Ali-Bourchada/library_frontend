import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatCardModule,],  // Add RouterModule here

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
