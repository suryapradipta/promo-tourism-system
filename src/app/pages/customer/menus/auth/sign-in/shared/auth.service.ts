import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = [
    { username: 'customer@gmail.com', password: 'customer@gmail.com', role: 'customer' },
    { username: 'ministry@gmail.com', password: 'ministry@gmail.com', role: 'ministry' },
    { username: 'merchant@gmail.com', password: 'merchant@gmail.com', role: 'merchant' },
  ];

  login(username: string, password: string) {
    const user = this.users.find((u) => u.username === username && u.password === password);


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
