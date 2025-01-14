import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/home/dashboard`);
  }
}
