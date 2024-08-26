import { AddressSearch, Person } from '../models/person';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public findAll(): Observable<Person[]> {
    return this.http.get<Person[]>(`${Config.webApiUrl}/v1/person`);
  }

  public findAllByHolding(holdingId: string): Observable<Person[]> {
    return this.http.get<Person[]>(
      `${Config.webApiUrl}/v1/person/holding/${holdingId}`
    );
  }

  public findAllByCompany(companyId: string): Observable<Person[]> {
    return this.http.get<Person[]>(
      `${Config.webApiUrl}/v1/person/company/${companyId}`
    );
  }

  public findAllByOffice(officeId: string): Observable<Person[]> {
    return this.http.get<Person[]>(
      `${Config.webApiUrl}/v1/person/office/${[officeId]}`
    );
  }

  public findAllByResponsibility(
    responsibilityId: string
  ): Observable<Person[]> {
    return this.http.get<Person[]>(
      `${Config.webApiUrl}/v1/person/${responsibilityId}/responsibility`
    );
  }

  public findAllByContractType(contractType: string): Observable<Person[]> {
    return this.http.get<Person[]>(
      `${Config.webApiUrl}/v1/person/${this.officeId}/${contractType}/contract-type`
    );
  }

  public findById(id: any): Observable<Person> {
    return this.http.get<Person>(`${Config.webApiUrl}/v1/person/${id}`);
  }

  public findByRequest(): Observable<Person> {
    return this.http.get<Person>(`${Config.webApiUrl}/v1/person/token`);
  }

  public create(person: Person, file: File): Observable<Person> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personRequest', JSON.stringify(person));

    return this.http.post<Person>(`${Config.webApiUrl}/v1/person`, formData);
  }

  public update(id: string, person: Person, file: File): Observable<Person> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personRequest', JSON.stringify(person));

    return this.http.put<Person>(
      `${Config.webApiUrl}/v1/person/${id}`,
      formData
    );
  }

  public deactivate(id: string): Observable<Person> {
    return this.http.delete<Person>(`${Config.webApiUrl}/v1/person/${id}`);
  }

  public findAddress(cep: string): Observable<AddressSearch> {
    return this.http.get<AddressSearch>(
      `${Config.webApiUrl}/v1/district/${cep}/cep`
    );
  }
}
