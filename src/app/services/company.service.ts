import { Config } from './../config/api.config';
import { Company } from './../models/company';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Company[]> {
    return this.http.get<Company[]>(`${Config.webApiUrl}/company`);
  }
}
