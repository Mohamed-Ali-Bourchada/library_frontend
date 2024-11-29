import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminUser: any;

  constructor() {}

  ngOnInit(): void {
    // Fetch the admin user details
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.isAdmin) {
        this.adminUser = user;
      } else {
        // If the user is not admin, redirect to home or another page
        window.location.href = '/'; // You can redirect to another route using Angular Router as well
      }
    }
  }

  // Add additional methods for managing data (e.g., managing users, stats, etc.)
}
