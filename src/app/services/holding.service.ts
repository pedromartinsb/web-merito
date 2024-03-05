import { Observable } from 'rxjs';
import { Config } from './../config/api.config';
import { Holding } from './../models/holding';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HoldingService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Holding[]> {
    return this.http.get<Holding[]>(`${Config.webApiUrl}/v1/holding`);
  }

  findById(id: any): Observable<Holding> {
    return this.http.get<Holding>(`${Config.webApiUrl}/v1/holding/${id}`);
  }

  create(holding: Holding): Observable<Holding> {
    return this.http.post<Holding>(`${Config.webApiUrl}/v1/holding`, holding);
  }

  update(id: string, holding: Holding): Observable<Holding> {
    return this.http.put<Holding>(`${Config.webApiUrl}/v1/holding/${id}`, holding);
  }

  delete(id: string): Observable<Holding> {
    return this.http.delete<Holding>(`${Config.webApiUrl}/v1/holding/${id}`);
  }
}
