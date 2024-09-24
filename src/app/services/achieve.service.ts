import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Achieve } from '../pages/person/person-appointment/person-appointment-achieve/person-appointment-achieve.component';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AchieveService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Achieve[]> {
    return this.http.get<Achieve[]>(`${Config.webApiUrl}/v1/achieve`);
  }

  findById(id: any): Observable<Achieve> {
    return this.http.get<Achieve>(`${Config.webApiUrl}/v1/achieve/${id}`);
  }

  findByPersonId(personId: any): Observable<Achieve> {
    return this.http.get<Achieve>(
      `${Config.webApiUrl}/v1/achieve/${personId}/person`
    );
  }

  create(achieve: Achieve): Observable<Achieve> {
    return this.http.post<Achieve>(`${Config.webApiUrl}/v1/achieve`, achieve);
  }

  update(id: string, achieve: Achieve): Observable<Achieve> {
    return this.http.put<Achieve>(
      `${Config.webApiUrl}/v1/achieve/${id}`,
      achieve
    );
  }
}
