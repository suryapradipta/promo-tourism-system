
import { Injectable } from '@angular/core';
import { AuthModel } from '../models';
import { v4 as uuidv4 } from 'uuid';
import {USERS} from "../mock/mock-users";

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private users: AuthModel[] = [];

  constructor() {
    this.loadUsersData();
    this.initializeData();
  }

  private initializeData() {
    if (this.users.length === 0) {
      for (const user of USERS) {
        this.saveUsersData(user)
      }
    }
  }

  private loadUsersData() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }

  private saveUsersData(newUser: AuthModel) {
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  getUsersData(): AuthModel[] {
    this.loadUsersData();
    return this.users;
  }

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
      isFirstLogin: role === 'merchant',
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
