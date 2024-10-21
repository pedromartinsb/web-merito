import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AddressSearch} from "../../../models/person";
import {Config} from "../../../config/api.config";
import {Message} from "../../../pages/person/person-appointment/person-appointment.component";
import {Employee} from "../employee.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public findAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${Config.webApiUrl}/v1/person`);
  }

  public findAllByHolding(holdingId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${Config.webApiUrl}/v1/person/holding/${holdingId}`
    );
  }

  public findAllByCompany(companyId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${Config.webApiUrl}/v1/person/company/${companyId}`
    );
  }

  public findAllByOffice(officeId: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${Config.webApiUrl}/v1/person/office/${[officeId]}`
    );
  }

  public findAllByResponsibility(
    responsibilityId: string
  ): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${Config.webApiUrl}/v1/person/${responsibilityId}/responsibility`
    );
  }

  public findAllByContractType(contractType: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${Config.webApiUrl}/v1/person/${this.officeId}/${contractType}/contract-type`
    );
  }

  public findById(id: any): Observable<Employee> {
    return this.http.get<Employee>(`${Config.webApiUrl}/v1/person/${id}`);
  }

  public findByRequest(): Observable<Employee> {
    return this.http.get<Employee>(`${Config.webApiUrl}/v1/person/token`);
  }

  public create(person: Employee, file: File): Observable<Employee> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personRequest', JSON.stringify(person));

    return this.http.post<Employee>(`${Config.webApiUrl}/v1/person`, formData);
  }

  public update(id: string, person: Employee, file: File): Observable<Employee> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personRequest', JSON.stringify(person));

    return this.http.put<Employee>(
      `${Config.webApiUrl}/v1/person/${id}`,
      formData
    );
  }

  public updateWithoutFile(id: string, person: Employee): Observable<Employee> {
    const formData = new FormData();
    formData.append('personRequest', JSON.stringify(person));

    return this.http.put<Employee>(
      `${Config.webApiUrl}/v1/person/${id}/no-picture`,
      formData
    );
  }

  public changePassword(id: string, newPassword: string): Observable<Employee> {
    const formData = new FormData();
    formData.append('newPassword', newPassword);

    return this.http.put<Employee>(
      `${Config.webApiUrl}/v1/person/${id}/change-password`,
      formData
    );
  }

  public deactivate(id: string): Observable<Employee> {
    return this.http.delete<Employee>(`${Config.webApiUrl}/v1/person/${id}`);
  }

  public findAddress(cep: string): Observable<AddressSearch> {
    return this.http.get<AddressSearch>(
      `${Config.webApiUrl}/v1/district/${cep}/cep`
    );
  }

  public sendMessage(message: Message): Observable<void> {
    return this.http.post<void>(
      `${Config.webApiUrl}/v1/person/message`,
      message
    );
  }
}
