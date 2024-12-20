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

import { AuthGuard } from './guards/auth.guard'; // The AuthGuard to protect routes
import { AdminGuard } from './guards/admin.guard'; // The AdminGuard to protect admin routes
import { AllBooksComponent } from './all-books/all-books.component';
import { EmprintAdminComponent } from './admin-dashboard/emprintAdmin/emprint-admin/emprint-admin.component';

export const routes: Routes = [
  // Accessible by everyone
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'all-books', component: AllBooksComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'historique/:id', component: HistoriqueComponent, canActivate: [AuthGuard] },
  { path: 'emprenter', component: EmprenterComponent, canActivate: [AuthGuard] },

  // Admin routes, protected by AdminGuard
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard], // Protected by AdminGuard
    children: [
      { path: '', component: BooksForAdminComponent },
      { path: 'booksForAdmin', component: BooksForAdminComponent },
      { path: 'usersForAdmin', component: UsersForAdminComponent },
      { path: 'createBook', component: CreateBookComponent },
      {path:'empreunte',component:EmprintAdminComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
