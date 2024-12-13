import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Person} from "../../../models/person";
import {Config} from "../../../config/api.config";

@Injectable({
  providedIn: 'root'
})
export class ResponsibilitiesService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public findAllResponsibilities(): Observable<any[]> {
    return this.http.get<any[]>(
      `${Config.webApiUrl}/v1/responsibility`
    );
  }
}
