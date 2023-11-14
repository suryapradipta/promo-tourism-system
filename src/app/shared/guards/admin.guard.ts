import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})

/**
 * Determines whether a route can be activated based on the user's role.
 *
 * @param route The activated route snapshot.
 * @param state The router state snapshot.
 * @returns True if the user has the 'ministry' or 'merchant' role, false otherwise.
 */
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user = this.authService.getCurrentUser();

    if ((user && user.role === 'ministry') || user.role === 'merchant') {
      return true;
    }

    // Redirect non-admin users
    this.router.navigate(['/']);
    return false;
  }
}
