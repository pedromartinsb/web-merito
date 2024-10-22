import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Person} from "../../../models/person";
import {Config} from "../../../config/api.config";
import {ProfessionalRequest} from "../professional.model";

@Injectable({
  providedIn: 'root'
})
export class ProfessionalsService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public findAllSuppliers(): Observable<Person[]> {
    return this.http.get<Person[]>(
      `${Config.webApiUrl}/v1/person/${this.officeId}/Professional/contract-type`
    );
  }

  public create(professional: ProfessionalRequest, file: File): Observable<Person> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personRequest', JSON.stringify(professional));

    return this.http.post<Person>(`${Config.webApiUrl}/v1/person`, formData);
  }
}
