import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from 'src/app/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RoutinesService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/routine`);
  }

  public findAllByOffice(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/routine/office/${this.officeId}`);
  }
}
