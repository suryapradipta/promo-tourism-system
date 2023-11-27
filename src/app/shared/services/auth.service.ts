/**
 * This service manages user authentication, providing functionality for user login, logout,
 * checking the authentication status, updating passwords, and determining if it's the user's
 * first login. It interacts with local storage for data persistence.
 */

import { Injectable } from '@angular/core';
import { AuthModel } from '../models';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';

  private users: AuthModel[] = [];

  constructor(private http: HttpClient) {
    this.loadUsersData();
  }

  createUser(email: string, password: string, role: string) {
    const authData: AuthModel = {
      id: null,
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
    return this.http.post(this.apiUrl, authData);

  }

  /**
   * Private method to load user data from local storage.
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

  /**
   * Check if it's the user's first login.
   *
   * @param {string} email - User's email address.
   * @returns {boolean} - True if it's the user's first login, false otherwise.
   */
  isFirstLogin(email: string): boolean {
    const merchant = this.users.find((m) => m.email === email);
    return merchant ? merchant.isFirstLogin : false;
  }

  /**
   * Update the user's password and set isFirstLogin to false.
   *
   * @param {string} email - User's email address.
   * @param {string} newPassword - New password to set.
   */
  updatePassword(email: string, newPassword: string): void {
    const merchant = this.users.find((m) => m.email === email);
    if (merchant) {
      merchant.password = newPassword;
      merchant.isFirstLogin = false;
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  /**
   * Check if the entered password matches the stored password for a given email.
   *
   * @param {string} email - User's email address.
   * @param {string} password - Entered password to check.
   * @returns {boolean} - True if the entered password matches the stored password, false otherwise.
   */
  checkPassword(email: string, password: string): boolean {
    const user = this.users.find((u) => u.email === email);
    return user && user.password === password;
  }
}
