import { Component, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';  // Import the pagination module
import { FormsModule } from '@angular/forms';  // Import FormsModule to use ngModel
import { UserServiceService } from '../../services/userService/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-for-admin',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],  // Add FormsModule here
  templateUrl: './users-for-admin.component.html',
  styleUrls: ['./users-for-admin.component.css']
})
export class UsersForAdminComponent implements OnInit {
  adminUser: any;
  users: any[] = [];  // Array to store all users
  filteredUsers: any[] = [];  // Array to store filtered users based on the search
  searchTerm: string = '';  // Variable to hold the search input

  // Pagination properties
  page: number = 1;  // Current page
  itemsPerPage: number = 10;  // Number of items per page

  constructor(private userService: UserServiceService) {}

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;  // Initialize filteredUsers with all users initially
      },
      error: (Error) => {
        console.log(Error);
      }
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  onSearch(): void {
    if (this.searchTerm) {
      this.filteredUsers = this.users.filter((user) => {
        return (
          user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    } else {
      this.filteredUsers = [...this.users];  // Reset to all users if searchTerm is empty
    }
    this.page = 1;  // Reset pagination to the first page when search is done
  }
}
