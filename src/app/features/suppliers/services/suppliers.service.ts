import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Person } from "../../../models/person";
import { Config } from "../../../config/api.config";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Supplier, SupplierRequest } from "../supplier.model";

@Injectable({
  providedIn: "root",
})
export class SuppliersService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem("officeId");
  }

  public findAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${Config.webApiUrl}/v1/person/${this.officeId}/Supplier/contract-type`);
  }

  public findAllByContractType(contractType: string): Observable<any[]> {
    const params = new HttpParams().set("contractType", contractType);
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/person/contract-type`, { params });
  }

  // public create(supplier: SupplierRequest, file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("personRequest", JSON.stringify(supplier));

  //   return this.http.post<any>(`${Config.webApiUrl}/v1/person`, formData);
  // }

  create(supplier: SupplierRequest, file: File | null): Observable<any> {
    const formData = new FormData();
    formData.append("data", JSON.stringify(supplier));

    if (file) {
      formData.append("file", file);
    }
    return this.http.post<any>(`${Config.webApiUrl}/v1/person`, formData);
  }

  public update(id: string, supplier: SupplierRequest, file?: File): Observable<Person> {
    const formData = new FormData();
    formData.append("personRequest", JSON.stringify(supplier));

    if (file != null) {
      formData.append("file", file);
      return this.http.put<Person>(`${Config.webApiUrl}/v1/person/${id}`, formData);
    } else {
      return this.http.put<Person>(`${Config.webApiUrl}/v1/person/${id}/no-picture`, formData);
    }
  }

  delete(id: string): Observable<Supplier> {
    return this.http.delete<Supplier>(`${Config.webApiUrl}/v1/person/${id}`);
  }
}
