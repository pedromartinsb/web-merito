import { Person } from '../models/person';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Person[]> {
    return this.http.get<Person[]>(`${API_CONFIG.baseUrl}/person`)
  }

  findById(id: any): Observable<Person> {
    return this.http.get<Person>(`${API_CONFIG.baseUrl}/person/${id}`);
  }

  create(person: Person): Observable<Person> {
    return this.http.post<Person>(`${API_CONFIG.baseUrl}/person`, person);
  }

  update(person: Person): Observable<Person> {
    return this.http.put<Person>(`${API_CONFIG.baseUrl}/clientes/${person.id}`, person);
  }

  delete(id: any): Observable<Person> {
    return this.http.delete<Person>(`${API_CONFIG.baseUrl}/clientes/${id}`);
  }
}
