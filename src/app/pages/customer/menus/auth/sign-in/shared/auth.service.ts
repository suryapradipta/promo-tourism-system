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

  private currentUser: any = null;

  login(username: string, password: string) {
    const user = this.users.find((u) => u.username === username && u.password === password);


    if (user) {
      this.currentUser = user;
    }
    console.log("USER",user)
    return user;
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  constructor() { }
}
