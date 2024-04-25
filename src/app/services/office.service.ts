import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressSearch, Office } from '../models/office';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class OfficeService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Office[]> {
    return this.http.get<Office[]>(`${Config.webApiUrl}/v1/office`);
  }

  findById(id: any): Observable<Office> {
    return this.http.get<Office>(`${Config.webApiUrl}/v1/office/${id}`);
  }

  create(office: Office): Observable<Office> {
    return this.http.post<Office>(`${Config.webApiUrl}/v1/office`, office);
  }

  update(id: string, office: Office): Observable<Office> {
    return this.http.put<Office>(`${Config.webApiUrl}/v1/office/${id}`, office);
  }

  delete(id: string): Observable<Office> {
    return this.http.delete<Office>(`${Config.webApiUrl}/v1/office/${id}`);
  }

  findAddress(cep: string): Observable<AddressSearch> {
    return this.http.get<AddressSearch>(
      `${Config.webApiUrl}/v1/district/${cep}/cep`
    );
  }
}
