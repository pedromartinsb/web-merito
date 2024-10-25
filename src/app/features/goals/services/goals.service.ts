import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Config} from "../../../config/api.config";

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  constructor(private http: HttpClient) {}

  public findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/goal`);
  }

  public finish(id: string): Observable<any> {
    return this.http.put<any[]>(`${Config.webApiUrl}/v1/goal/${id}/finish`, {status: 'FINISHED'});
  }

  public cancel(id: string): Observable<any> {
    return this.http.put<any[]>(`${Config.webApiUrl}/v1/goal/${id}/cancel`, {status: 'CANCELLED'});
  }
}
