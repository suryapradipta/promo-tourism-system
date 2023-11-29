import {Injectable} from '@angular/core';
import {AuthModel} from '../models';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
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
    return this.http.post(`${this.apiUrl}/register`, authData);
  }

  login(email: string, password: string): Observable<{ token: string }> {
    const authData = {email: email, password: password};
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, authData);
  }

  isFirstLogin(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/is-first-login/${email}`);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current-user`);
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

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  updatePassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-password`, { email, newPassword });
  }

  checkPassword(email: string, currentPassword: string): Observable<any> {
    return this.http.post<boolean>(`${this.apiUrl}/check-password`, { email, currentPassword });
  }
}
