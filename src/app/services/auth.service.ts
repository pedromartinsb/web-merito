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
        `${Config.webApiUrl}/v1/auth/sign-in`,
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
    officeResponse: OfficeResponse[]
  ) {
    localStorage.setItem('token', authToken);
    this.roleAs = role;
    localStorage.setItem('role', JSON.stringify(this.roleAs));
    let companies = [];
    officeResponse.map((office) => {
      companies.push(office.fantasyName);
    });
    localStorage.setItem('companies', JSON.stringify(companies));
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

  logout(): any {
    localStorage.clear();
    return this.http.delete(`${Config.webApiUrl}/v1/auth/sign-out`);
  }

  getRole(): string[] {
    this.roleAs = JSON.parse(localStorage.getItem('role'));
    return this.roleAs;
  }
}
