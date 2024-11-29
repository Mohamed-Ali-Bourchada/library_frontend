import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Import RouterModule
import { AuthService } from '../services/auth.service'; // Import AuthService

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Subscribe to login state from AuthService
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
    this.authService.username$.subscribe(username => {
      this.username = username;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);  // Redirect to the home page after logging out
  }
}
