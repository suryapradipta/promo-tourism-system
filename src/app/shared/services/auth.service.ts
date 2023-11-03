import { Injectable } from '@angular/core';
import {Validators} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  setupDefaultAdminUser(): void {
    const defaultMinistryUser = {
      email: 'ministry',
      password: 'ministry',
      role: 'ministry',
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const ministryUserExists = users.some((user) => user.email === defaultMinistryUser.email);

    if (!ministryUserExists) {
      users.push(defaultMinistryUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    const defaultMerchantUser = {
      email: 'merchant',
      password: 'merchant',
      role: 'merchant',
    };

    const merchantUserExists = users.some((user) => user.email === defaultMerchantUser.email);

    if (!merchantUserExists) {
      users.push(defaultMerchantUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

  }

  login(username: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u: any) => u.email == username && u.password == password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  constructor() { }
}
