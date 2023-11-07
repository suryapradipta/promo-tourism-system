import { Injectable } from '@angular/core';
import { AuthModel } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: AuthModel[] = [];

  constructor() {
    this.loadUsersData();
  }

  private loadUsersData() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('[S-IN SERVICE] LOAD USER', this.users);
  }

  getUsersData() {
    return this.users;
  }

  login(email: string, password: string) {
    // after merchant acc created, need to load local storage again
    this.loadUsersData();
    const user = this.users.find(
      (founded: AuthModel) =>
        founded.email === email && founded.password === password
    );

    console.log("LOGIN USER", user);
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
