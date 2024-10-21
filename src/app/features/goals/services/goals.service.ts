import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Config} from "../../../config/api.config";
import {Goal} from "../../../models/goal";

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  constructor(private http: HttpClient) {}

  public findAll(): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${Config.webApiUrl}/v1/goal`);
  }
}
