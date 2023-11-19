
import { Injectable } from '@angular/core';
import { SignUpService } from '.';
import { AuthModel } from '../models';

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
  }


  getUsersData(): AuthModel[] {
    this.loadUsersData();
    return this.users;
  }

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

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): AuthModel | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

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
