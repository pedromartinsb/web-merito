import { Config } from './../config/api.config';
import { AddressSearch, Company } from './../models/company';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  public findAll(): Observable<Company[]> {
    return this.http.get<Company[]>(`${Config.webApiUrl}/v1/company`);
  }

  public findAllByHolding(holdingId: any): Observable<Company[]> {
    return this.http.get<Company[]>(
      `${Config.webApiUrl}/v1/company/holding/${holdingId}`
    );
  }

  public findById(id: any): Observable<Company> {
    return this.http.get<Company>(`${Config.webApiUrl}/v1/company/${id}`);
  }

  public create(company: Company): Observable<Company> {
    return this.http.post<Company>(`${Config.webApiUrl}/v1/company`, company);
  }

  public update(id: string, company: Company): Observable<Company> {
    return this.http.put<Company>(
      `${Config.webApiUrl}/v1/company/${id}`,
      company
    );
  }

  public delete(id: string): Observable<Company> {
    return this.http.delete<Company>(`${Config.webApiUrl}/v1/company/${id}`);
  }

  public findAddress(cep: string): Observable<AddressSearch> {
    return this.http.get<AddressSearch>(
      `${Config.webApiUrl}/v1/district/${cep}/cep`
    );
  }
}
