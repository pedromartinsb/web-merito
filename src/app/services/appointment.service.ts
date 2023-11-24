import { Config } from './../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${Config.webApiUrl}/appointment`);
  }
}
