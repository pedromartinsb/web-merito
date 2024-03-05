import { Config } from './../config/api.config';
import { Segment } from './../models/segment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SegmentService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Segment[]> {
    return this.http.get<Segment[]>(`${Config.webApiUrl}/v1/segment`);
  }

  findById(id: any): Observable<Segment> {
    return this.http.get<Segment>(`${Config.webApiUrl}/v1/segment/${id}`);
  }

  create(segment: Segment): Observable<Segment> {
    return this.http.post<Segment>(`${Config.webApiUrl}/v1/segment`, segment);
  }

  update(id: string, segment: Segment): Observable<Segment> {
    return this.http.put<Segment>(`${Config.webApiUrl}/v1/segment/${id}`, segment);
  }

  delete(id: string): Observable<Segment> {
    return this.http.delete<Segment>(`${Config.webApiUrl}/v1/segment/${id}`);
  }
}
