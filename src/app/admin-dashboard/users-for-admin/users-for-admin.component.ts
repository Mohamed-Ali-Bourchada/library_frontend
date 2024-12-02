import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserServiceService } from '../../services/userService/user-service.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-users-for-admin',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './users-for-admin.component.html',
  styleUrl: './users-for-admin.component.css'
})
export class UsersForAdminComponent implements OnInit{

  users :Array<any>=[]
  constructor(private userService:UserServiceService){}

  getAllUsers(){
    this.userService.getAllUsers().subscribe({
      next:(data)=>{
        this.users=data;
      },
      error:(Error)=>{
        console.log(Error);
        
      }
    })
  }
  ngOnInit(): void {
    this.getAllUsers()
  }

}
