import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  // Check login status
  checkLoginStatus() {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.isLoggedIn = true;
      this.isAdmin = parsedUser.isAdmin;
      this.username = parsedUser.username;
    }
    // Ensure change detection runs
    this.cdr.detectChanges();
  }

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.username = '';
    this.router.navigate(['/login']);
    // Ensure change detection runs
    this.cdr.detectChanges();
  }
}
