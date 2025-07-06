import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AddressSearch, Office } from "../models/office";
import { Config } from "../config/api.config";

@Injectable({
  providedIn: "root",
})
export class OfficeService {
  private baseUrl: string = "v1/office";

  constructor(private http: HttpClient) {}

  public findAll(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/${this.baseUrl}`);
  }

  public findAllDTO(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/office/dto`);
  }

  public findAllByHolding(holdingId: string): Observable<Office[]> {
    return this.http.get<Office[]>(`${Config.webApiUrl}/v1/office/holding/${holdingId}`);
  }

  public findAllByCompany(companyId: string): Observable<Office[]> {
    return this.http.get<Office[]>(`${Config.webApiUrl}/v1/office/company/${companyId}`);
  }

  public findById(id: any): Observable<Office> {
    return this.http.get<Office>(`${Config.webApiUrl}/v1/office/${id}`);
  }

  public create(office: Office): Observable<Office> {
    return this.http.post<Office>(`${Config.webApiUrl}/v1/office`, office);
  }

  public update(id: string, office: Office): Observable<Office> {
    return this.http.put<Office>(`${Config.webApiUrl}/v1/office/${id}`, office);
  }

  public delete(id: string): Observable<Office> {
    return this.http.delete<Office>(`${Config.webApiUrl}/v1/office/${id}`);
  }

  public findAddress(cep: string): Observable<AddressSearch> {
    return this.http.get<AddressSearch>(`${Config.webApiUrl}/v1/district/${cep}/cep`);
  }
}
