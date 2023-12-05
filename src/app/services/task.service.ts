import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Task[]> {
    return this.http.get<Task[]>(`${Config.webApiUrl}/task`);
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(`${Config.webApiUrl}/task`, task);
  }
}
