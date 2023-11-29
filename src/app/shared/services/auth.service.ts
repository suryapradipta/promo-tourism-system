import {Injectable} from '@angular/core';
import {AuthModel} from '../models';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users/';

  private users: AuthModel[] = [];

  constructor(private http: HttpClient) {
  }

  createUser(email: string, password: string, role: string) {
    const authData: AuthModel = {
      id: null,
      email: email,
      password: password,
      role:
        role === 'merchant'
          ? 'merchant'
          : role === 'customer'
            ? 'customer'
            : role === 'ministry'
              ? 'ministry'
              : '',
      isFirstLogin: role === 'merchant',
    };
    return this.http.post(this.apiUrl + 'register', authData);
  }

  login(email: string, password: string): Observable<{ token: string }> {
    const authData = {email: email, password: password};
    return this.http.post<{ token: string }>(this.apiUrl + 'login', authData);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(this.apiUrl + 'current-user');
  }

  getCurrentUserJson(): AuthModel | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
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
    return user && user.password === password;
  }
}
