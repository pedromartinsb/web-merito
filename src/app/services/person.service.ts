import { Person } from '../models/person';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';
import { Routine } from '../models/routine';
import { Assignment } from '../models/assignment';

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

  update(id: string, person: Person): Observable<Person> {
    return this.http.put<Person>(`${Config.webApiUrl}/person/${id}`, person);
  }

  delete(id: string): Observable<Person> {
    return this.http.delete<Person>(`${Config.webApiUrl}/person/${id}`);
  }

  removePersonFromCompany(personId: string, companyId: string): Observable<Person> {
    return this.http.delete<Person>(`${Config.webApiUrl}/person/${personId}/${companyId}/company`);
  }

  findAllByCompany(idCompany: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${Config.webApiUrl}/person/${idCompany}/company`);
  }

  addRoutinesToPerson(routines: string[], personId: string): Observable<Routine> {
    return this.http.post<Routine>(`${Config.webApiUrl}/person/routines`, {personId, routines});
  }

  addTasksToPerson(tasks: string[], personId: string): Observable<Task> {
    return this.http.post<Task>(`${Config.webApiUrl}/person/tasks`, {personId, tasks});
  }

  addAssignmentsToPerson(assignments: string[], personId: string): Observable<Assignment> {
    return this.http.post<Assignment>(`${Config.webApiUrl}/person/assignments`, {personId, assignments});
  }
}
