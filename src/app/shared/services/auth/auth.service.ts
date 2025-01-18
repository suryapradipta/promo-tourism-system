/**
 * This service handles user authentication, providing methods for user creation, login,
 * checking authentication status, retrieving user information, updating passwords,
 * and checking password validity. It interacts with the server's user API.
 */
import { Injectable } from '@angular/core';
import { Auth } from '../../models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;

  /**
   * @constructor
   * @param {HttpClient} http - Angular's HTTP client for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Create a new user with the specified email, password, and role.
   *
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @param {string} role - User's role (merchant, customer, ministry).
   * @returns {Observable<any>} - Observable containing the result of the user creation.
   */
  createUser(email: string, password: string, role: string): Observable<any> {
    const authData: Auth = {
      _id: null,
      email: email,
      password: password,
      role:
        role === 'merchant'
          ? 'merchant'
          : role === 'customer'
          ? 'customer'
          : role === 'ministry'
          ? 'ministry'
          : '',
      isFirstLogin: role === 'merchant',
    };
    return this.http.post(`${this.apiUrl}/register`, authData);
  }

  /**
   * Authenticate user by checking the provided email and password.
   *
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @returns {Observable<{ token: string }>} - Observable containing the authentication token.
   */
  login(email: string, password: string): Observable<{ token: string }> {
    const authData = { email: email, password: password };
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, authData);
  }

  /**
   * Check if a user has logged in for the first time.
   *
   * @param {string} email - User's email address.
   * @returns {Observable<boolean>} - Observable indicating whether it's the user's first login.
   */
  isFirstLogin(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-first-login/${email}`);
  }

  /**
   * Get the current authenticated user from the server.
   *
   @returns {Observable<any>} - Observable containing the current user information.
   */
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current-user`);
  }

  /**
   * Get the current authenticated user from local storage.
   *
   * @returns {Auth | null} - Current authenticated user data or null if not authenticated.
   */
  getCurrentUserJson(): Auth | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get the authentication token from local storage.
   *
   * @returns {string | null} - Authentication token or null if not authenticated.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Log out the current user by removing their token and data from local storage.
   */
  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  /**
   * Check if a user is currently authenticated.
   *
   * @returns {boolean} - True if a user is authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Update the user's password.
   *
   * @param {string} email - User's email address.
   * @param {string} newPassword - User's new password.
   * @returns {Observable<any>} - Observable containing the result of the password update.
   */
  updatePassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-password`, {
      email,
      newPassword,
    });
  }

  /**
   * Check the validity of the current password.
   *
   * @param {string} email - User's email address.
   * @param {string} currentPassword - User's current password.
   * @returns {Observable<boolean>} - Observable indicating whether the current password is valid.
   */
  checkPassword(email: string, currentPassword: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check-password`, {
      email,
      currentPassword,
    });
  }
}
