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
    return this.http.get<Assignment[]>(`${Config.webApiUrl}/assignment`);
  }

  findById(id: any): Observable<Assignment> {
    return this.http.get<Assignment>(`${Config.webApiUrl}/assignment/${id}`);
  }

  create(assignment: Assignment): Observable<Assignment> {
    return this.http.post<Assignment>(`${Config.webApiUrl}/assignment`, assignment);
  }
}
