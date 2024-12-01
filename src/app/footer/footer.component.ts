import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'], // Fixed typo
})
export class FooterComponent {
  isVisible = false; // Tracks visibility state of the footer
  footerVisible =false;

  // Listen to scroll events
@HostListener('window:scroll', [])
  onScroll(): void {
    const footer = document.querySelector('footer');
    const footerPosition = footer?.getBoundingClientRect().top ?? 10;
    const screenHeight = window.innerHeight;

    if (footerPosition <= screenHeight) {
      this.footerVisible = true;
    } else {
      this.footerVisible = false;
    }
  }
}
