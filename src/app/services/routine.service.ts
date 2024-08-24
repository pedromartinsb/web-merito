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

  public findAll(): Observable<Routine[]> {
    return this.http.get<Routine[]>(`${Config.webApiUrl}/v1/routine`);
  }

  public findAllByPerson(personId: string): Observable<Routine[]> {
    return this.http.get<Routine[]>(
      `${Config.webApiUrl}/v1/routine/person/${personId}`
    );
  }

  public findById(id: any): Observable<Routine> {
    return this.http.get<Routine>(`${Config.webApiUrl}/v1/routine/${id}`);
  }

  public findByName(name: any): Observable<Array<Routine>> {
    return this.http.get<Array<Routine>>(
      `${Config.webApiUrl}/v1/routine/name/${name}`
    );
  }

  public create(routine: Routine): Observable<Routine> {
    return this.http.post<Routine>(`${Config.webApiUrl}/v1/routine`, routine);
  }

  public update(id: string, routine: Routine): Observable<Routine> {
    return this.http.put<Routine>(
      `${Config.webApiUrl}/v1/routine/${id}`,
      routine
    );
  }

  public updateByName(id: string, routine: Routine): Observable<Routine> {
    return this.http.put<Routine>(
      `${Config.webApiUrl}/v1/routine/name/${id}`,
      routine
    );
  }

  public delete(id: string): Observable<Routine> {
    return this.http.delete<Routine>(`${Config.webApiUrl}/v1/routine/${id}`);
  }

  public findAllByResponsibility(
    responsibilityId: string
  ): Observable<Routine[]> {
    return this.http.get<Routine[]>(
      `${Config.webApiUrl}/v1/routine/${responsibilityId}/responsibility`
    );
  }
}
