import { AddressSearch, Person } from '../models/person';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Person[]> {
    return this.http.get<Person[]>(`${Config.webApiUrl}/v1/person`);
  }

  findAllByResponsibility(responsibilityId: string): Observable<Person[]> {
    return this.http.get<Person[]>(
      `${Config.webApiUrl}/v1/person/${responsibilityId}/responsibility`
    );
  }

  findAllByContractType(contractType: string): Observable<Person[]> {
    return this.http.get<Person[]>(
      `${Config.webApiUrl}/v1/person/${contractType}/contract-type`
    );
  }

  findById(id: any): Observable<Person> {
    return this.http.get<Person>(`${Config.webApiUrl}/v1/person/${id}`);
  }

  create(person: Person): Observable<Person> {
    return this.http.post<Person>(`${Config.webApiUrl}/v1/person`, person);
  }

  update(id: string, person: Person): Observable<Person> {
    return this.http.put<Person>(`${Config.webApiUrl}/v1/person/${id}`, person);
  }

  delete(id: string): Observable<Person> {
    return this.http.delete<Person>(`${Config.webApiUrl}/v1/person/${id}`);
  }

  findAddress(cep: string): Observable<AddressSearch> {
    return this.http.get<AddressSearch>(
      `${Config.webApiUrl}/v1/district/${cep}/cep`
    );
  }
}
