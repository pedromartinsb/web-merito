import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Config } from "../../../config/api.config";

@Injectable({
  providedIn: "root",
})
export class GoalsService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem("officeId");
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/goal`);
  }

  findAllGo(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:9090/goals`);
  }

  findAllByOffice(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/goal/office/${this.officeId}`);
  }

  finish(id: string): Observable<any> {
    return this.http.put<any[]>(`${Config.webApiUrl}/v1/goal/${id}/finish`, { status: "FINISHED" });
  }

  cancel(id: string): Observable<any> {
    return this.http.put<any[]>(`${Config.webApiUrl}/v1/goal/${id}/cancel`, { status: "CANCELLED" });
  }

  create(goal: any): Observable<any> {
    return this.http.post(`${Config.webApiUrl}/v1/goal`, goal);
  }

  update(goal: any): Observable<any> {
    return this.http.put(`${Config.webApiUrl}/v1/goal/${goal.id}`, goal);
  }
}
