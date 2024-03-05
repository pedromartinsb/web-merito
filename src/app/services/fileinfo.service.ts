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
    return this.http.get<Fileinfo[]>(`${Config.webApiUrl}/v1/document/files`)
  }

  findByName(filename: string): Observable<Fileinfo> {
    return this.http.get<Fileinfo>(`${Config.webApiUrl}/v1/document/files/${filename}`);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${Config.webApiUrl}/v1/document/upload`, formData);
  }
}
