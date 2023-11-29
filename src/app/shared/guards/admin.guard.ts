
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services';
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      tap((currentUser) => {
        if (AdminGuard.isAdmin(currentUser)) {
          return true;
        }

        // Redirect non-admin users
        this.router.navigate(['/']);
        return false;
      })
    );
  }
  private static isAdmin(user: any): boolean {
    return user && (user.role === 'ministry' || user.role === 'merchant');
  }
}
