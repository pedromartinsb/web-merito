import { Config } from './../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/department';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  findAllByCompany(idCompany: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${Config.webApiUrl}/department/company/${idCompany}`);
  }

  findAllPersonByCompany(idCompany: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${Config.webApiUrl}/department/company/${idCompany}/person`);
  }
}
