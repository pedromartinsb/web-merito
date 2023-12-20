import { Config } from './../config/api.config';
import { Goal } from './../models/goal';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${Config.webApiUrl}/goal`);
  }

  findById(id: any): Observable<Goal> {
    return this.http.get<Goal>(`${Config.webApiUrl}/goal/${id}`);
  }

  create(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${Config.webApiUrl}/goal`, goal);
  }

  update(id: string, goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${Config.webApiUrl}/goal/${id}`, goal);
  }

  delete(id: string): Observable<Goal> {
    return this.http.delete<Goal>(`${Config.webApiUrl}/goal/${id}`);
  }
}
