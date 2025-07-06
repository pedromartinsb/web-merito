import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Config } from "src/app/config/api.config";

@Injectable({
  providedIn: "root",
})
export class DashboardsService {
  constructor(private http: HttpClient) {}

  public getOverview(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/dashboards/overview`);
  }

  public getOverviewFilter(start: string, end: string): Observable<any> {
    let params = new HttpParams();
    params = params.set("start", start);
    params = params.set("end", end);
    return this.http.get<any>(`${Config.webApiUrl}/v1/dashboards/overview/filter`, { params });
  }
}
