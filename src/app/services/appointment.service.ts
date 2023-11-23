import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${API_CONFIG.baseUrl}/appointment`);
  }
}
