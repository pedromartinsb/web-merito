import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Config } from "../../../config/api.config";
import { Professional, ProfessionalRequest } from "../professional.model";

@Injectable({
  providedIn: "root",
})
export class ProfessionalsService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem("officeId");
  }

  public findAllProfessionals(): Observable<Professional[]> {
    return this.http.get<Professional[]>(`${Config.webApiUrl}/v1/person/${this.officeId}/Professional/contract-type`);
  }

  create(professional: ProfessionalRequest, file: File | null): Observable<any> {
    const formData = new FormData();
    // formData.append("data", JSON.stringify(professional));
    formData.append("personRequest", JSON.stringify(professional));

    if (file) {
      formData.append("file", file);
    }
    return this.http.post(`${Config.webApiUrl}/v1/person`, formData);
  }

  update(id: string, professional: ProfessionalRequest, file: File | null): Observable<any> {
    const formData = new FormData();
    // formData.append("data", JSON.stringify(professional));
    formData.append("personRequest", JSON.stringify(professional));

    if (file != null) {
      formData.append("file", file);
      return this.http.put(`${Config.webApiUrl}/v1/person/${id}`, formData);
    }

    return this.http.put(`${Config.webApiUrl}/v1/person/${id}/no-picture`, formData);
  }

  delete(id: string): Observable<Professional> {
    return this.http.delete<Professional>(`${Config.webApiUrl}/v1/person/${id}`);
  }
}
