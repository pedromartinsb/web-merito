import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Config } from "../../../config/api.config";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class TasksService {
  constructor(private http: HttpClient) {}

  public findAll(userId?: string): Observable<any[]> {
    let params = new HttpParams();
    if (userId) {
      params = params.set("userId", userId.toString());
    }
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/task`, { params });
  }

  public findById(id: string): Observable<any> {
    return this.http.get<any>(`${Config.webApiUrl}/v1/task/${id}`);
  }

  public handleToDoTask(id: string): Observable<void> {
    let params = new HttpParams();
    params = params.set("id", id);
    return this.http.put<void>(`${Config.webApiUrl}/v1/task/to-do`, params);
  }

  public handleStartTask(id: string): Observable<void> {
    let params = new HttpParams();
    params = params.set("id", id);
    return this.http.put<void>(`${Config.webApiUrl}/v1/task/start-task`, params);
  }

  public handleDoneTask(id: string): Observable<void> {
    let params = new HttpParams();
    params = params.set("id", id);
    return this.http.put<void>(`${Config.webApiUrl}/v1/task/done`, params);
  }

  public create(task: any): Observable<void> {
    return this.http.post<void>(`${Config.webApiUrl}/v1/task`, task);
  }

  public update(task: any): Observable<void> {
    return this.http.put<void>(`${Config.webApiUrl}/v1/task/${task.id}`, task);
  }

  public cancel(id: string): Observable<any> {
    let params = new HttpParams();
    params = params.set("id", id);
    return this.http.put<any[]>(`${Config.webApiUrl}/v1/task/cancel`, params);
  }
}
