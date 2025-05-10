import { Config } from "./../config/api.config";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ForgotPassword } from "../pages/forgot-password/forgot-password.component";

@Injectable({
  providedIn: "root",
})
export class ForgotPasswordService {
  constructor(private http: HttpClient) {}

  forgotPassword(forgotPassword: ForgotPassword): Observable<any> {
    return this.http.post<any>(`${Config.webApiUrl}/v1/password/forgot-password`, forgotPassword);
  }
}
