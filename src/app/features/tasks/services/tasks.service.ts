import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Config} from "../../../config/api.config";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public findAllByOffice(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/task/office/${this.officeId}`);
  }

  public findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/task`);
  }

  public finish(id: string): Observable<any> {
    return this.http.put<any[]>(`${Config.webApiUrl}/v1/task/${id}/finish`, {status: 'FINISHED'});
  }

  public cancel(id: string): Observable<any> {
    return this.http.put<any[]>(`${Config.webApiUrl}/v1/task/${id}/cancel`, {status: 'CANCELLED'});
  }
}
