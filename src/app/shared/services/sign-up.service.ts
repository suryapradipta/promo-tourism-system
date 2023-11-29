/**
 * This service manages user registration, providing functionality for user registration,
 * loading existing user data, and initializing mock user data during construction.
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
   * Initializes the service, loads existing user data from local storage,
   * and initializes mock user data if no users are present.
   *
   * @constructor
   */
  constructor() {
    this.loadUsersData();
  }


  /**
   * Load user data from local storage.
   */
  private loadUsersData() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }

  /**
   * Save user data to local storage.
   *
   * @param {AuthModel} newUser - User data to be saved.
   */
  private saveUsersData(newUser: AuthModel) {
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  /**
   * Get the current list of users.
   *
   * @returns {AuthModel[]} - Array of user data.
   */
  getUsersData(): AuthModel[] {
    this.loadUsersData();
    return this.users;
  }

  /**
   * Register a new user with the provided email, password, and role.
   * Generates a unique ID for the user and checks for existing users with the same email.
   * If the email is unique, saves the new user data and returns true, otherwise returns false.
   *
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @param {string} role - User's role ('merchant', 'customer', 'ministry').
   * @returns {boolean} - True if registration is successful, false if the email is not unique.
   */
  register(email: string, password: string, role: string, id?: string): boolean {
    const uniqueID = id || uuidv4();

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
      isFirstLogin: role === 'merchant',
    };

    const existingUser = this.users.find((exist) => exist.email === email);

    if (!existingUser) {
      this.saveUsersData(user);
      return true;
    }
    return false;
  }
}
