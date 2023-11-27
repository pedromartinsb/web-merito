import { Login } from './../models/login';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Config } from '../config/api.config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {

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

  successfulLogin(authToken: string) {
    localStorage.setItem('token', authToken);
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
}
