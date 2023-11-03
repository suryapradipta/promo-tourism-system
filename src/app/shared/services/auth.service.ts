import {Injectable} from '@angular/core';
import {AuthModel} from "../models/auth.model";
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: AuthModel[] = [];

  constructor() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }


  setupDefaultAdminUser(): void {


    const defaultMinistryUser = {
      id: uuidv4(),
      email: 'ministry',
      password: 'ministry',
      role: 'ministry',
    };


    const ministryUserExists = this.users.some((user) => user.email === defaultMinistryUser.email);

    if (!ministryUserExists) {
      this.users.push(defaultMinistryUser);
      localStorage.setItem('users', JSON.stringify(this.users));
    }

    const defaultMerchantUser = {
      id:uuidv4(),
      email: 'merchant',
      password: 'merchant',
      role: 'merchant',
    };

    const merchantUserExists = this.users.some((user) => user.email === defaultMerchantUser.email);

    if (!merchantUserExists) {
      this.users.push(defaultMerchantUser);
      localStorage.setItem('users', JSON.stringify(this.users));
    }

  }

  login(username: string, password: string) {
    const user = this.users.find((u: any) => u.email == username && u.password == password);

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
}
