import { Injectable } from '@angular/core';
import { Task } from '../pages/person/person-appointment/person-appointment-task/person-appointment-task.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Task[]> {
    return this.http.get<Task[]>(`${Config.webApiUrl}/v1/task`);
  }

  findById(id: any): Observable<Task> {
    return this.http.get<Task>(`${Config.webApiUrl}/v1/task/${id}`);
  }

  findByPersonId(personId: any): Observable<Task> {
    return this.http.get<Task>(
      `${Config.webApiUrl}/v1/task/${personId}/person`
    );
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(`${Config.webApiUrl}/v1/task`, task);
  }

  update(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${Config.webApiUrl}/v1/task/${id}`, task);
  }
}
