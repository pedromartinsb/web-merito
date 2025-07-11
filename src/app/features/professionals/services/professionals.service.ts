import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Person} from "../../../models/person";
import {Config} from "../../../config/api.config";
import {Professional, ProfessionalRequest} from "../professional.model";

@Injectable({
  providedIn: 'root'
})
export class ProfessionalsService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public findAllProfessionals(): Observable<Professional[]> {
    return this.http.get<Professional[]>(
      `${Config.webApiUrl}/v1/person/${this.officeId}/Professional/contract-type`
    );
  }

  public create(professional: ProfessionalRequest, file: File): Observable<Person> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personRequest', JSON.stringify(professional));

    return this.http.post<Person>(`${Config.webApiUrl}/v1/person`, formData);
  }

  public update(id: string, professional: ProfessionalRequest, file?: File): Observable<Person> {
    const formData = new FormData();
    formData.append('personRequest', JSON.stringify(professional));

    if (file != null) {
      formData.append('file', file);
      return this.http.put<Person>(`${Config.webApiUrl}/v1/person/${id}`, formData);
    } else {
      return this.http.put<Person>(`${Config.webApiUrl}/v1/person/${id}/no-picture`, formData);
    }
  }

  delete(id: string): Observable<Professional> {
    return this.http.delete<Professional>(`${Config.webApiUrl}/v1/person/${id}`);
  }
}
