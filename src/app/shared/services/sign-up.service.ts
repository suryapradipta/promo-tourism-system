import {Injectable} from '@angular/core';
import {AuthModel} from "../models/auth.model";
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private users: AuthModel [] = [];

  // Fetch data from local storage during service initialization
  constructor() {
    // USER ACCOUNT TESTING PURPOSE
    this.register('ministry','ministry','ministry')
    this.register('merchant','merchant','merchant')

    this.loadUsersData();
  }

  private loadUsersData() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    console.log("[S-UP SERVICE]LOAD-USER-DATA", this.users)
  }

  // Method to add data to the array and save it in local storage
  private saveUsersData(newUser: AuthModel) {
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));

    console.log("[S-UP SERVICE]SAVE-USER DATA", this.users);
  }

  getUsersData() {
    return this.users;
  }

  register(email: string, password: string, role:string): boolean {
    const uniqueID = uuidv4();

    const user: AuthModel = {
      id: uniqueID,
      email: email,
      password: password,
      role:
        (role === 'merchant') ? 'merchant' :
          (role === 'customer') ? 'customer' :
            (role === 'ministry') ? 'ministry' :
              ''
    };

    // unique email
    const existingUser = this.users.find((exist) => exist.email === email);

    if (!existingUser) {
      this.saveUsersData(user);
      return true;
    }
    return false;
  }
}
