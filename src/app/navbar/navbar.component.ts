import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true, // Ensure it's standalone
  imports: [CommonModule, RouterModule], // Add RouterModule here
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  username: string = '';
  userId: number | null = null; // Correctly declare userId

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Subscribe to login state
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    // Subscribe to admin state
    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });

    // Subscribe to username
    this.authService.username$.subscribe((username) => {
      this.username = username;
    });

    // Subscribe to userId
    this.authService.userId$.subscribe((userId) => {
      this.userId = userId;
      console.log('User ID in Navbar:', this.userId); // Debug log
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Redirect to home page
  }

  onNavigateToProfile(): void {
    if (this.userId) {
      this.router.navigate(['/profile', this.userId]); // Navigate to profile with userId
    } else {
      console.error('User ID is not available.');
    }
  }
}
