import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Task[]> {
    return this.http.get<Task[]>(`${Config.webApiUrl}/task`);
  }

  findById(id: any): Observable<Task> {
    return this.http.get<Task>(`${Config.webApiUrl}/task/${id}`);
  }

  
  create(task: Task): Observable<Task> {
    return this.http.post<Task>(`${Config.webApiUrl}/task`, task);
  }
  
  update(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${Config.webApiUrl}/task/${id}`, task);
  }
  
  delete(id: string): Observable<Task> {
    return this.http.delete<Task>(`${Config.webApiUrl}/task/${id}`);
  }

  findAllByPerson(idPerson: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${Config.webApiUrl}/task/${idPerson}/person`);
  }

  addPersonToTask(personId: string, taskId: string): Observable<Task> {
    return this.http.post<Task>(`${Config.webApiUrl}/task/person`, {personId, taskId});
  }

  addPersonsToTask(persons: string[], taskId: string): Observable<Task> {
    return this.http.post<Task>(`${Config.webApiUrl}/task/persons`, {taskId, persons});
  }
}
