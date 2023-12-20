/**
 * This guard implements CanActivate to restrict access to routes based on user roles.
 * It checks if the current user is an admin (ministry or merchant) and allows access
 * to the route if true, otherwise, it redirects non-admin users to the default route.
 */
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  /**
   * Constructor function for AdminGuard.
   *
   * @constructor
   * @param {AuthService} authService - The service providing authentication functionality.
   * @param {Router} router - The Angular router service for navigation.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * CanActivate method to determine if a route can be activated based on user roles.
   *
   * @param {ActivatedRouteSnapshot} route - The route to be activated.
   * @param {RouterStateSnapshot} state - The state of the router.
   * @returns {Observable<boolean>} - Observable that emits a boolean indicating
   * whether the route can be activated or not.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      tap((currentUser) => {
        if (AdminGuard.isAdmin(currentUser)) {
          return true;
        }

        this.router.navigate(['/']);
        return false;
      })
    );
  }

  /**
   * Check if a user is an admin based on their role.
   *
   * @param {any} user - The user object to be checked.
   * @returns {boolean} - True if the user is an admin, false otherwise.
   * @private
   */
  private static isAdmin(user: any): boolean {
    return user && (user.role === 'ministry' || user.role === 'merchant');
  }
}
