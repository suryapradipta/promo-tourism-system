import {Injectable} from '@angular/core';
import {AuthModel} from "../models/auth.model";
import {v4 as uuidv4} from 'uuid';
import {SignUpService} from "./sign-up.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TESTING PURPOSE
  constructor(private signUpService:SignUpService) {
    signUpService.register('ministry','ministry','ministry')
    signUpService.register('merchant','merchant','merchant')
  }

  login(username: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u: any) => u.email === username && u.password === password);
    console.log("USERSSSSS", users);

    console.log("USER", user);

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
