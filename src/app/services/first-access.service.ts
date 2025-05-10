import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserResponse } from "../models/person";
import { Config } from "../config/api.config";

@Injectable({
  providedIn: "root",
})
export class FirstAccessService {
  constructor(private http: HttpClient) {}

  createPassword(createPasswordRequest: any): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${Config.webApiUrl}/v1/first-access/create-password`, createPasswordRequest);
  }
}
