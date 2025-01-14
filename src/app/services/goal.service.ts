import { Config } from './../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Goal } from '../features/employees/components/employee-appointment/employee-appointment.component';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public findAllByOffice(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${Config.webApiUrl}/v1/goal/office/${this.officeId}`);
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

  public updateByName(id: string, goal: Goal): Observable<Goal> {
    return this.http.put<Goal>(`${Config.webApiUrl}/v1/goal/name/${id}`, goal);
  }

  public delete(id: string): Observable<Goal> {
    return this.http.delete<Goal>(`${Config.webApiUrl}/v1/goal/${id}`);
  }
}
