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

  findAllTaskByPerson(idPerson: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${Config.webApiUrl}/task/${idPerson}/person`);
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
}
