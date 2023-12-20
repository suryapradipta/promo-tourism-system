/**
 * This interceptor adds the user's authentication token to the headers of outgoing HTTP requests,
 * ensuring secure communication with the server by including the Authorization header.
 */
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * @constructor
   * @param {AuthService} authService - The service responsible for user authentication.
   */
  constructor(private authService: AuthService) {}

  /**
   * Intercept the outgoing HTTP request and add the user's authentication token to the headers.
   *
   * @param {HttpRequest<any>} req - The original HTTP request.
   * @param {HttpHandler} next - The next HTTP handler in the chain.
   * @returns {Observable<HttpEvent<any>>} - Observable representing the intercepted HTTP event.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken),
    });
    return next.handle(authRequest);
  }
}
