/**
 * This service manages user authentication, providing functionality for user login, logout,
 * and checking the authentication status. It utilizes the SignUpService to register
 * test user accounts during construction for testing purposes.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Injectable } from '@angular/core';
import { SignUpService } from '.';
import { AuthModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: AuthModel[] = [];

  /**
   * Initializes the service, loads user data from local storage, and registers
   * test user accounts for testing purposes.
   *
   * @constructor
   * @param {SignUpService} signUpService - The service responsible for user registration.
   */
  constructor(private signUpService: SignUpService) {
    this.loadUsersData();

    this.signUpService.register('ministry@gmail.com', 'ministry', 'ministry');
    this.signUpService.register('merchant@gmail.com', 'merchant', 'merchant');
  }

  /**
   * To load user data from local storage.
   */
  private loadUsersData() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }


  /**
   * Get the current user data.
   *
   * @returns {AuthModel[]} - Array of user data.
   */
  getUsersData(): AuthModel[] {
    this.loadUsersData();
    return this.users;
  }

  /**
   * Authenticate user by checking the provided email and password.
   * If a matching user is found, store the user data in local storage and return the user.
   *
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @returns {AuthModel | null} - Authenticated user data or null if authentication fails.
   */
  login(email: string, password: string): AuthModel | null {
    this.loadUsersData();
    const user = this.users.find(
      (founded: AuthModel) =>
        founded.email === email && founded.password === password
    );

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  }

  /**
   * Log out the current user by removing their data from local storage.
   */
  logout(): void {
    localStorage.removeItem('currentUser');
  }

  /**
   * Get the currently authenticated user.
   *
   * @returns {AuthModel | null} - Current authenticated user data or null if not authenticated.
   */
  getCurrentUser(): AuthModel | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Check if a user is currently authenticated.
   *
   * @returns {boolean} - True if a user is authenticated, false otherwise.
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('currentUser');
    return !!token;
  }

  isFirstLogin(email: string): boolean {
    const merchant = this.users.find((m) => m.email === email);
    return merchant ? merchant.isFirstLogin : false;
  }

  updatePassword(email: string, newPassword: string): void {
    const merchant = this.users.find((m) => m.email === email);
    if (merchant) {
      merchant.password = newPassword;
      merchant.isFirstLogin = false;
      localStorage.setItem('users', JSON.stringify(this.users));

    }
  }

  checkPassword(email: string, password: string): boolean {
    const user = this.users.find((u) => u.email === email);

    // Check if the user exists and the entered password matches the stored password
    return user && user.password === password;
  }
}
