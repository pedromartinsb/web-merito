import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Person } from "../../../models/person";
import { Config } from "../../../config/api.config";
import { Employee, EmployeeRequest } from "../employee.model";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  public findAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${Config.webApiUrl}/v1/person`);
  }

  public findAllByContractType(contractType: string): Observable<any[]> {
    const params = new HttpParams().set("contractType", contractType);
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/person/contract-type`, { params });
  }

  public findAllEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${Config.webApiUrl}/v1/person/contract-type`);
  }

  public create(employee: EmployeeRequest, file: File): Observable<Person> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("personRequest", JSON.stringify(employee));

    return this.http.post<Person>(`${Config.webApiUrl}/v1/person`, formData);
  }

  public update(id: string, employee: EmployeeRequest, file?: File): Observable<Person> {
    const formData = new FormData();
    formData.append("personRequest", JSON.stringify(employee));

    if (file != null) {
      formData.append("file", file);
      return this.http.put<Person>(`${Config.webApiUrl}/v1/person/${id}`, formData);
    } else {
      return this.http.put<Person>(`${Config.webApiUrl}/v1/person/${id}/no-picture`, formData);
    }
  }

  delete(id: string): Observable<Employee> {
    return this.http.delete<Employee>(`${Config.webApiUrl}/v1/person/${id}`);
  }
}
