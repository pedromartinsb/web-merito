import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';
import { Routine } from '../models/routine';

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Routine[]> {
    return this.http.get<Routine[]>(`${Config.webApiUrl}/v1/routine`);
  }

  findById(id: any): Observable<Routine> {
    return this.http.get<Routine>(`${Config.webApiUrl}/v1/routine/${id}`);
  }

  create(routine: Routine): Observable<Routine> {
    return this.http.post<Routine>(`${Config.webApiUrl}/v1/routine`, routine);
  }

  update(id: string, routine: Routine): Observable<Routine> {
    return this.http.put<Routine>(
      `${Config.webApiUrl}/v1/routine/${id}`,
      routine
    );
  }

  delete(id: string): Observable<Routine> {
    return this.http.delete<Routine>(`${Config.webApiUrl}/v1/routine/${id}`);
  }

  findAllByResponsibility(responsibilityId: string): Observable<Routine[]> {
    return this.http.get<Routine[]>(
      `${Config.webApiUrl}/v1/routine/${responsibilityId}/responsibility`
    );
  }
}
