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
    return this.http.get<Task[]>(`${Config.webApiUrl}/v1/task`);
  }

  findById(id: any): Observable<Task> {
    return this.http.get<Task>(`${Config.webApiUrl}/v1/task/${id}`);
  }

  
  create(task: Task): Observable<Task> {
    return this.http.post<Task>(`${Config.webApiUrl}/v1/task`, task);
  }
  
  update(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${Config.webApiUrl}/v1/task/${id}`, task);
  }
  
  delete(id: string): Observable<Task> {
    return this.http.delete<Task>(`${Config.webApiUrl}/v1/task/${id}`);
  }

  findAllByPerson(idPerson: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${Config.webApiUrl}/v1/task/${idPerson}/person`);
  }

  addPersonToTask(personId: string, taskId: string): Observable<Task> {
    return this.http.post<Task>(`${Config.webApiUrl}/v1/task/person`, {personId, taskId});
  }

  addPersonsToTask(persons: string[], taskId: string): Observable<Task> {
    return this.http.post<Task>(`${Config.webApiUrl}/v1/task/persons`, {taskId, persons});
  }
}
