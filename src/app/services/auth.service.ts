import { Login } from './../models/login';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  roleAs: string[] = [];

  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string) {
    return this.http.post<Login>(`${Config.webApiUrl}/auth/signin`,
    {
      username,
      password,
    },
    {
      observe: 'response'
    })
  }

  successfulLogin(authToken: string, role: string[]) {
    localStorage.setItem('token', authToken);
    this.roleAs = role;
    localStorage.setItem('role', JSON.stringify(this.roleAs));
  }

  isAuthenticated() {
    let token = localStorage.getItem('token');
    if(token != null) {
      return !this.jwtService.isTokenExpired(token);
    }
    return false
  }

  logout() {
    localStorage.clear();
  }

  getRole() {
    this.roleAs = JSON.parse(localStorage.getItem('role'));
    return this.roleAs;
  }
}
