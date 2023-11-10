import { Injectable } from '@angular/core';
import { AuthModel } from '../models';
import {SignUpService} from "./sign-up.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: AuthModel[] = [];

  constructor(private signUpService:SignUpService) {
    this.loadUsersData();

    // USER ACCOUNT TESTING PURPOSE
    this.signUpService.register('ministry@gmail.com','ministry','ministry')
    this.signUpService.register('merchant@gmail.com','merchant','merchant')
  }

  private loadUsersData() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }

  getUsersData() {
    this.loadUsersData();
    return this.users;
  }

  login(email: string, password: string) {
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

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
