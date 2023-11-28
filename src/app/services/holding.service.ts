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
    return this.http.get<Holding[]>(`${Config.webApiUrl}/holding`);
  }
}
