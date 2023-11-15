/**
 * This service is responsible for user registration, providing functionality
 * to register users with unique email addresses and store their information locally.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Injectable } from '@angular/core';
import { AuthModel } from '../models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private users: AuthModel[] = [];

  /**
   * Initializes the service and loads existing user data from local storage.
   *
   * @constructor
   */
  constructor() {
    this.loadUsersData();
  }

  /**
   * Private method to load user data from local storage.
   */
  private loadUsersData() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }

  /**
   * Private method to save new user data to local storage.
   *
   * @param {AuthModel} newUser - The user object to be saved.
   */
  private saveUsersData(newUser: AuthModel) {
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
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
   * Register a new user with a unique email address.
   *
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @param {string} role - User's role (merchant, customer, ministry).
   * @returns {boolean} - True if registration is successful, false if the email is already in use.
   */
  register(email: string, password: string, role: string): boolean {
    const uniqueID = uuidv4();

    const user: AuthModel = {
      id: uniqueID,
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
    };

    // Check if the email is already in use
    const existingUser = this.users.find((exist) => exist.email === email);

    // If the email is unique, save the new user data
    if (!existingUser) {
      this.saveUsersData(user);
      return true;
    }
    // Registration failed if the email is already in use
    return false;
  }
}
