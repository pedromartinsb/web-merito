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

  findById(id: any): Observable<Company> {
    return this.http.get<Company>(`${Config.webApiUrl}/company/${id}`);
  }

  create(company: Company): Observable<Company> {
    return this.http.post<Company>(`${Config.webApiUrl}/company`, company);
  }

  update(id: string, company: Company): Observable<Company> {
    return this.http.post<Company>(`${Config.webApiUrl}/company/${id}`, company);
  }

  delete(id: string): Observable<Company> {
    return this.http.delete<Company>(`${Config.webApiUrl}/company/${id}`);
  }
}
