import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, retry, throwError } from 'rxjs';

import { Config } from '../config/api.config';
import { Login } from './../models/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  roleAs: string[] = [];

  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string) {
    return this.http
      .post<Login>(
        `${Config.webApiUrl}/v1/auth/signin`,
        {
          username,
          password,
        },
        {
          observe: 'response',
        }
      )
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
      // Return an observable with a user-facing error message.
      return throwError(
        () =>
          new Error(
            'Estamos com instabilidade nos nossos servidores, por favor tentar mais tarde.'
          )
      );
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
      if (error.status === 500 && error.error.message === 'Bad credentials') {
        // Return an observable with a user-facing error message.
        return throwError(
          () => new Error('Usuário ou Senha estão incorretos.')
        );
      }
      // Return an observable with a user-facing error message.
      return throwError(
        () =>
          new Error(
            'Estamos com instabilidade nos nossos servidores, por favor tentar mais tarde.'
          )
      );
    }
  }

  successfulLogin(authToken: string, role: string[]) {
    localStorage.setItem('token', authToken);
    this.roleAs = role;
    localStorage.setItem('role', JSON.stringify(this.roleAs));
  }

  isAuthenticated() {
    let token = localStorage.getItem('token');
    if (token != null) {
      return !this.jwtService.isTokenExpired(token);
    }
    return false;
  }

  logout() {
    localStorage.clear();
  }

  getRole() {
    this.roleAs = JSON.parse(localStorage.getItem('role'));
    return this.roleAs;
  }
}
