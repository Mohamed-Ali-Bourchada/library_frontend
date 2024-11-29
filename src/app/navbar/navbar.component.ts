import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router'; // Import ActivatedRoute and Params
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
  userId: number | null = null;  // Declare userId property

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

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

    // Subscribe to queryParams to access userId from URL
    this.route.queryParams.subscribe((params: Params) => {  // Explicitly type params as Params
      const id = params['id'];
      this.userId = id ? +id : null;  // Convert id to a number using the unary + operator
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);  // Redirect to the home page after logging out
  }
onNavigateToProfile(): void {
  const userId = this.authService.getLoggedInUserId();  // Ensure this method returns the correct userId

  if (userId) {
    console.log('Navigating to profile with userId:', userId);  // Log userId to verify it's correct
    this.router.navigate(['/profile', userId]);  // Correctly navigate to '/profile/:id'
  } else {
    console.error('User ID is not available.');
  }
}






}
