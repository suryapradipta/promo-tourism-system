import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private users: any[] = JSON.parse(localStorage.getItem('users')) || [];

  register(email: string, password: string): boolean {
    const user = { email, password, role: 'customer' };

    const existingUser = this.users.find((u) => u.email === email);

    if (!existingUser) {
      this.users.push(user);
      localStorage.setItem('users', JSON.stringify(this.users));
      return true;
    }

    return false;
  }

}
