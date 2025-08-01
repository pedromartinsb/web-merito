import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Person} from "../../../models/person";
import {Config} from "../../../config/api.config";
import {Employee, EmployeeRequest} from "../employee.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public create(employee: EmployeeRequest, file: File): Observable<Person> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personRequest', JSON.stringify(employee));

    return this.http.post<Person>(`${Config.webApiUrl}/v1/person`, formData);
  }

  public update(id: string, employee: EmployeeRequest, file?: File): Observable<Person> {
    const formData = new FormData();
    formData.append('personRequest', JSON.stringify(employee));

    if (file != null) {
      formData.append('file', file);
      return this.http.put<Person>(`${Config.webApiUrl}/v1/person/${id}`, formData);
    } else {
      return this.http.put<Person>(`${Config.webApiUrl}/v1/person/${id}/no-picture`, formData);
    }
  }

  public findAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${Config.webApiUrl}/v1/person`);
  }

  public findAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${Config.webApiUrl}/v1/person/${this.officeId}/CLT/contract-type`
    );
  }

  delete(id: string): Observable<Employee> {
    return this.http.delete<Employee>(`${Config.webApiUrl}/v1/person/${id}`);
  }
}
