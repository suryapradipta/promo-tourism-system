import { Injectable } from '@angular/core';
import { AuthModel } from '../models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private users: AuthModel[] = [];

  constructor() {
    this.loadUsersData();
  }

  private loadUsersData() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }

  private saveUsersData(newUser: AuthModel) {
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  getUsersData() {
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
    };

    const existingUser = this.users.find((exist) => exist.email === email);

    if (!existingUser) {
      this.saveUsersData(user);
      return true;
    }
    return false;
  }
}
