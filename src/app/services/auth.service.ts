import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, retry, throwError } from 'rxjs';

import { Config } from '../config/api.config';
import { Login } from './../models/login';
import { OfficeResponse } from '../models/office';

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
      );
  }

  successfulLogin(
    authToken: string,
    role: string[],
    companyNames: string[],
    officeResponse: OfficeResponse[]
  ) {
    localStorage.setItem('token', authToken);
    this.roleAs = role;
    localStorage.setItem('role', JSON.stringify(this.roleAs));
    localStorage.setItem('companies', JSON.stringify(companyNames));
    localStorage.setItem('officeResponses', JSON.stringify(officeResponse));
    localStorage.setItem('officeId', officeResponse[0].id);
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
