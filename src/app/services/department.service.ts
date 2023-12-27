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

  findAll(): Observable<Department[]> {
    return this.http.get<Department[]>(`${Config.webApiUrl}/department`);
  }

  findById(id: any): Observable<Department> {
    return this.http.get<Department>(`${Config.webApiUrl}/department/${id}`);
  }

  findAllByCompany(idCompany: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${Config.webApiUrl}/department/company/${idCompany}`);
  }

  create(department: Department): Observable<Department> {
    return this.http.post<Department>(`${Config.webApiUrl}/department`, department);
  }

  update(id: string, department: Department): Observable<Department> {
    return this.http.put<Department>(`${Config.webApiUrl}/department/${id}`, department);
  }

  delete(id: string): Observable<Department> {
    return this.http.delete<Department>(`${Config.webApiUrl}/department/${id}`);
  }
}
