/**
 * A route guard that determines whether a route can be activated based on the user's role.
 * If the user has the 'ministry' or 'merchant' role, the route is allowed; otherwise,
 * the user is redirected to the home page.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

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
