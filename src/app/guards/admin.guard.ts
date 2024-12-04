import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAdmin$.pipe(
      map(isAdmin => {
        if (!isAdmin) {
          // If the user is not an admin, redirect to the home page
          this.router.navigate(['/home']);
          return false;
        }
        return true; // Allow access for admins
      })
    );
  }
}
