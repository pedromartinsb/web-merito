import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Config} from "../../../config/api.config";
import { Responsibility, ResponsibilityRequest } from '../responsibility.model';

@Injectable({
  providedIn: 'root'
})
export class ResponsibilitiesService {

  constructor(private http: HttpClient) {
  }

  public findAllResponsibilities(): Observable<Responsibility[]> {
    return this.http.get<Responsibility[]>(`${Config.webApiUrl}/v1/responsibility`);
  }

  public findByOffice(officeId: String): Observable<Responsibility[]> {
    return this.http.get<Responsibility[]>(
      `${Config.webApiUrl}/v1/responsibility/office/${officeId}`
    );
  }

  public findById(responsibilityId: string): Observable<Responsibility> {
    return this.http.get<Responsibility>(`${Config.webApiUrl}/v1/responsibility/${responsibilityId}`
    );
  }

  public create(responsibility: ResponsibilityRequest): Observable<Responsibility> {
    return this.http.post<Responsibility>(`${Config.webApiUrl}/v1/responsibility`, responsibility);
  }

  public update(id: string, responsibility: ResponsibilityRequest): Observable<Responsibility> {
    return this.http.put<Responsibility>(`${Config.webApiUrl}/v1/responsibility/${id}`, responsibility);
  }

  public delete(id: string): Observable<Responsibility> {
    return this.http.delete<Responsibility>(`${Config.webApiUrl}/v1/responsibility/${id}`);
  }
}
