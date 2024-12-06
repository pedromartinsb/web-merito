import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Person} from "../../../models/person";
import {Config} from "../../../config/api.config";
import {HttpClient} from "@angular/common/http";
import { SupplierRequest } from '../supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  officeId: string;

  constructor(private http: HttpClient) {
    this.officeId = localStorage.getItem('officeId');
  }

  public findAllSuppliers(): Observable<Person[]> {
    return this.http.get<Person[]>(
      `${Config.webApiUrl}/v1/person/${this.officeId}/Supplier/contract-type`
    );
  }

  public create(supplier: SupplierRequest, file: File): Observable<Person> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('personRequest', JSON.stringify(supplier));

    return this.http.post<Person>(`${Config.webApiUrl}/v1/person`, formData);
  }
}
