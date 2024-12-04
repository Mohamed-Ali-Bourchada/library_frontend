import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { BooksForAdminComponent } from './admin-dashboard/books-for-admin/books-for-admin.component';
import { UsersForAdminComponent } from './admin-dashboard/users-for-admin/users-for-admin.component';
import { CreateBookComponent } from './admin-dashboard/create-book/create-book.component';
import { HistoriqueComponent } from './historique/historique/historique.component';
import { EmprenterComponent } from './emprenter/emprenter/emprenter.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },            // Default route for home
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'profile/:id', component: ProfileComponent },
  {path:'historique/:id',component:HistoriqueComponent},
  {path:'emprenter',component:EmprenterComponent},
  { path: 'admin-dashboard',component: AdminDashboardComponent 
    ,children:[
    {path:'',component:BooksForAdminComponent},
    {path:'booksForAdmin',component:BooksForAdminComponent},
    {path:'usersForAdmin',component:UsersForAdminComponent},
    {path:'createBook',component:CreateBookComponent}
  ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
