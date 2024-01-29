import { Config } from './../config/api.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity, Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${Config.webApiUrl}/appointment`);
  }

  findById(id: any): Observable<Appointment> {
    return this.http.get<Appointment>(`${Config.webApiUrl}/appointment/${id}`);
  }

  findByPersonAndDate(personId: any, startDate: Date, endDate: Date): Observable<Appointment[]> {
    let params = new HttpParams()
      .set('personId', personId)
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());      

    return this.http.get<Appointment[]>(`${Config.webApiUrl}/appointment`, { params });
  }

  findActivitiesByPersonAndDate(personId: any, startDate: Date, endDate: Date): Observable<Activity[]> {
    let params = new HttpParams()
      .set('personId', personId)
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());      

    return this.http.get<Activity[]>(`${Config.webApiUrl}/activity`, { params });
  }

  create(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${Config.webApiUrl}/appointment`, appointment);
  }

  update(id: string, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${Config.webApiUrl}/appointment/${id}`, appointment);
  }

  delete(id: string): Observable<Appointment> {
    return this.http.delete<Appointment>(`${Config.webApiUrl}/appointment/${id}`);
  }
}
