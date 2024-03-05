import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Assignment } from '../models/assignment';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${Config.webApiUrl}/v1/assignment`);
  }

  findById(id: any): Observable<Assignment> {
    return this.http.get<Assignment>(`${Config.webApiUrl}/v1/assignment/${id}`);
  }

  create(assignment: Assignment): Observable<Assignment> {
    return this.http.post<Assignment>(`${Config.webApiUrl}/v1/assignment`, assignment);
  }

  update(id: string, assignment: Assignment): Observable<Assignment> {
    return this.http.put<Assignment>(`${Config.webApiUrl}/v1/assignment/${id}`, assignment);
  }

  delete(id: string): Observable<Assignment> {
    return this.http.delete<Assignment>(`${Config.webApiUrl}/v1/assignment/${id}`);
  }

  findAllByPerson(idPerson: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${Config.webApiUrl}/v1/assignment/${idPerson}/person`);
  }

  addPersonToAssignment(personId: string, assignmentId: string): Observable<Assignment> {
    return this.http.post<Assignment>(`${Config.webApiUrl}/v1/assignment/person`, {personId, assignmentId});
  }

  addPersonsToAssignment(persons: string[], assignmentId: string): Observable<Assignment> {
    return this.http.post<Assignment>(`${Config.webApiUrl}/v1/assignment/persons`, {assignmentId, persons});
  }
}
