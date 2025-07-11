import { Config } from './../config/api.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity, Appointment, PersonAppointmentRoutineTask } from '../models/appointment';
import { monthlyTag } from '../models/tag';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${Config.webApiUrl}/v1/appointment`);
  }

  findAllViews(): Observable<PersonAppointmentRoutineTask[]> {
    return this.http.get<PersonAppointmentRoutineTask[]>(`${Config.webApiUrl}/v1/appointment/views`);
  }

  findViewsByPersonId(personId: string): Observable<PersonAppointmentRoutineTask[]> {
    return this.http.get<PersonAppointmentRoutineTask[]>(`${Config.webApiUrl}/v1/appointment/views/${personId}`);
  }

  findViewsByPersonIdAndCreatedAtBetween(personId: string, startDate: string, endDate: string): Observable<PersonAppointmentRoutineTask[]> {
    let params = new HttpParams()
      .set('personId', personId)
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<PersonAppointmentRoutineTask[]>(`${Config.webApiUrl}/v1/appointment/views/${personId}/dates`, { params });
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

  findActivitiesByPersonAndDate(personId: any, startDate: Date, endDate: Date): Observable<Activity[]> {
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

  createByDate(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(
      `${Config.webApiUrl}/v1/appointment/date`,
      appointment
    );
  }

  createAbstinence(abstinence: any): Observable<any> {
    return this.http.post<any>(
      `${Config.webApiUrl}/v1/appointment/abstinence`,
      abstinence
    );
  }

  createVacation(vacation: any): Observable<any> {
    return this.http.post<any>(
      `${Config.webApiUrl}/v1/appointment/vacation`,
      vacation
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

  getMonthlyTags(personId: any, startDate: Date, endDate: Date): Observable<monthlyTag[]> {
    let params = new HttpParams()
      .set('personId', personId)
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<monthlyTag[]>(`${Config.webApiUrl}/v1/activity/dates`, { params });
  }
}
