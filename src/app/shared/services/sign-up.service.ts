import { Injectable } from '@angular/core';
import {AuthModel} from "../models/auth.model";
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private users: AuthModel [] = [];

  constructor() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }

  register(email: string, password: string, role:string): boolean {
    const uniqueID = uuidv4();

    const user: AuthModel = {email: email, id: uniqueID, password: password, role:
        (role === 'merchant') ? 'merchant' :
        (role === 'customer') ? 'customer' :
          (role === 'ministry') ? 'ministry' :
            ''} ;

    const existingUser = this.users.find((u) => u.email === email);

    if (!existingUser) {
      this.users.push(user);
      localStorage.setItem('users', JSON.stringify(this.users));
      return true;
    }

    return false;
  }

}
