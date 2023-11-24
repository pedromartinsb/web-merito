import { Person } from '../models/person';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Person[]> {
    return this.http.get<Person[]>(`${Config.webApiUrl}/person`)
  }

  findById(id: any): Observable<Person> {
    return this.http.get<Person>(`${Config.webApiUrl}/person/${id}`);
  }

  create(person: Person): Observable<Person> {
    return this.http.post<Person>(`${Config.webApiUrl}/person`, person);
  }

  update(person: Person): Observable<Person> {
    return this.http.put<Person>(`${Config.webApiUrl}/clientes/${person.id}`, person);
  }

  delete(id: any): Observable<Person> {
    return this.http.delete<Person>(`${Config.webApiUrl}/clientes/${id}`);
  }
}
