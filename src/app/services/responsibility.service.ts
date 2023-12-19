import { Config } from './../config/api.config';
import { Responsibility } from './../models/responsibility';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsibilityService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Responsibility[]> {
    return this.http.get<Responsibility[]>(`${Config.webApiUrl}/responsibility`);
  }

  findById(id: any): Observable<Responsibility> {
    return this.http.get<Responsibility>(`${Config.webApiUrl}/responsibility/${id}`);
  }

  create(responsibility: Responsibility): Observable<Responsibility> {
    return this.http.post<Responsibility>(`${Config.webApiUrl}/responsibility`, responsibility);
  }
}
