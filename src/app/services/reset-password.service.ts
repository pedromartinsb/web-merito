import { Config } from "./../config/api.config";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResetPassword } from "../pages/reset-password/reset-password.component";

@Injectable({
  providedIn: "root",
})
export class ResetPasswordService {
  constructor(private http: HttpClient) {}

  resetPassword(resetPassword: ResetPassword): Observable<any> {
    return this.http.post<any>(`${Config.webApiUrl}/v1/password/reset-password`, resetPassword);
  }
}
