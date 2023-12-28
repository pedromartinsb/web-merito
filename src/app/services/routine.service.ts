import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';
import { Routine } from '../models/routine';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Routine[]> {
    return this.http.get<Routine[]>(`${Config.webApiUrl}/routine`);
  }

  findById(id: any): Observable<Routine> {
    return this.http.get<Routine>(`${Config.webApiUrl}/routine/${id}`);
  }

  findAllByTask(idTask: string): Observable<Routine[]> {
    return this.http.get<Routine[]>(`${Config.webApiUrl}/routine/task/${idTask}`);
  }

  create(routine: Routine): Observable<Routine> {
    return this.http.post<Routine>(`${Config.webApiUrl}/routine`, routine);
  }

  update(id: string, routine: Routine): Observable<Routine> {
    return this.http.put<Routine>(`${Config.webApiUrl}/routine/${id}`, routine);
  }

  delete(id: string): Observable<Routine> {
    return this.http.delete<Routine>(`${Config.webApiUrl}/routine/${id}`);
  }

  findAllByPerson(idPerson: string): Observable<Routine[]> {
    return this.http.get<Routine[]>(`${Config.webApiUrl}/routine/${idPerson}/person`);
  }

  addPersonToRoutine(personId: string, routineId: string): Observable<Routine> {
    return this.http.post<Routine>(`${Config.webApiUrl}/routine/person`, {personId, routineId});
  }

  addPersonsToRoutine(persons: string[], routineId: string): Observable<Routine> {
    return this.http.post<Routine>(`${Config.webApiUrl}/routine/persons`, {routineId, persons});
  }
}
