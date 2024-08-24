import { Config } from './../config/api.config';
import { Goal } from './../models/goal';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  constructor(private http: HttpClient) {}

  public findAll(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${Config.webApiUrl}/v1/goal`);
  }

  public findAllByPerson(personId: string): Observable<Goal[]> {
    return this.http.get<Goal[]>(
      `${Config.webApiUrl}/v1/goal/person/${personId}`
    );
  }

  public findById(id: any): Observable<Goal> {
    return this.http.get<Goal>(`${Config.webApiUrl}/v1/goal/${id}`);
  }

  public create(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${Config.webApiUrl}/v1/goal`, goal);
  }

  public update(id: string, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${Config.webApiUrl}/v1/goal/${id}`, goal);
  }

  public updateByName(name: string, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(
      `${Config.webApiUrl}/v1/goal/name/${name}`,
      goal
    );
  }

  public delete(id: string): Observable<Goal> {
    return this.http.delete<Goal>(`${Config.webApiUrl}/v1/goal/${id}`);
  }
}
