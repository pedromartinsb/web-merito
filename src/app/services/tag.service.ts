import { Config } from './../config/api.config';
import { Tag } from './../models/tag';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${Config.webApiUrl}/v1/tag`);
  }

  findById(id: any): Observable<Tag> {
    return this.http.get<Tag>(`${Config.webApiUrl}/v1/tag/${id}`);
  }

  create(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(`${Config.webApiUrl}/v1/tag`, tag);
  }

  update(id: string, tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(`${Config.webApiUrl}/v1/tag/${id}`, tag);
  }

  delete(id: string): Observable<Tag> {
    return this.http.delete<Tag>(`${Config.webApiUrl}/v1/tag/${id}`);
  }
}
