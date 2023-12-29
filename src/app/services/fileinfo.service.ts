import { Fileinfo } from '../models/fileinfo';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class FileinfoService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Fileinfo[]> {
    return this.http.get<Fileinfo[]>(`${Config.webApiUrl}/fileinfo`)
  }

  findById(id: any): Observable<Fileinfo> {
    return this.http.get<Fileinfo>(`${Config.webApiUrl}/fileinfo/${id}`);
  }

  upload(fileinfo: Fileinfo): Observable<Fileinfo> {
    return this.http.post<Fileinfo>(`${Config.webApiUrl}/fileinfo`, fileinfo);
  }
}
