import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  username: string = '';
  userId: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

 ngOnInit(): void {
  this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
    this.isLoggedIn = isLoggedIn;
  });

  this.authService.isAdmin$.subscribe((isAdmin) => {
    this.isAdmin = isAdmin;
  });

  this.authService.username$.subscribe((username) => {
    this.username = username || '';  // Ensure it's a valid value
  });

  this.authService.userId$.subscribe((userId) => {
    this.userId = userId;
  });
}


  // Logout function to clear session and redirect to home page
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirect to home page after logging out
  }

  // Navigate to profile page with userId
  onNavigateToProfile(): void {
    if (this.userId) {
      this.router.navigate(['/profile', this.userId]); // Navigate to profile with userId
    } else {
      console.error('User ID is not available.');
    }
  }
  onNavigateToHistorique():void{
    if(this.userId){
    this.router.navigate(['/historique',this.userId])//voir leur historique 
  } else {
    console.error('User ID is not available.');
  }
}
}
