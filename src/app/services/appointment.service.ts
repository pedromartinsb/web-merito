import { Config } from './../config/api.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity, Appointment } from '../models/appointment';
import { monthlyTag } from '../models/tag';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${Config.webApiUrl}/v1/appointment`);
  }

  findById(id: any): Observable<Appointment> {
    return this.http.get<Appointment>(
      `${Config.webApiUrl}/v1/appointment/${id}`
    );
  }

  findByPersonAndDate(
    personId: any,
    startDate: Date,
    endDate: Date
  ): Observable<Appointment[]> {
    let params = new HttpParams()
      .set('personId', personId)
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<Appointment[]>(
      `${Config.webApiUrl}/v1/appointment/createdAt`,
      { params }
    );
  }

  findActivitiesByPersonAndDate(
    personId: any,
    startDate: Date,
    endDate: Date
  ): Observable<Activity[]> {
    let params = new HttpParams()
      .set('personId', personId)
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<Activity[]>(`${Config.webApiUrl}/v1/activity`, {
      params,
    });
  }

  create(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(
      `${Config.webApiUrl}/v1/appointment`,
      appointment
    );
  }

  update(id: string, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(
      `${Config.webApiUrl}/v1/appointment/${id}`,
      appointment
    );
  }

  delete(id: string): Observable<Appointment> {
    return this.http.delete<Appointment>(
      `${Config.webApiUrl}/v1/appointment/${id}`
    );
  }

  getMonthlyTags(
    personId: any,
    startDate: Date,
    endDate: Date
  ): Observable<monthlyTag[]> {
    let params = new HttpParams()
      .set('personId', personId)
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<monthlyTag[]>(
      `${Config.webApiUrl}/v1/activity/dates`,
      { params }
    );
  }
}
