import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Config } from "src/app/config/api.config";
import { RoutineRequest } from "../routine.model";

@Injectable({
  providedIn: "root",
})
export class RoutinesService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem("officeId");
  }

  public findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/routine`);
  }

  public findAllByOffice(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/routine/office/${this.officeId}`);
  }

  public findById(id: string): Observable<any> {
    return this.http.get<any>(`${Config.webApiUrl}/v1/routine/${id}`);
  }

  public create(routineRequest: RoutineRequest): Observable<any> {
    return this.http.post<any>(`${Config.webApiUrl}/v1/routine`, routineRequest);
  }

  public update(id: string, routineRequest: RoutineRequest): Observable<any> {
    return this.http.put<any>(`${Config.webApiUrl}/v1/routine/${id}`, routineRequest);
  }

  public delete(id: string): Observable<any> {
    return this.http.delete<any>(`${Config.webApiUrl}/v1/routine/${id}`);
  }
}
