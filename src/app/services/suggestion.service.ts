import { Config } from './../config/api.config';
import { Suggestion } from './../models/suggestion';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(`${Config.webApiUrl}/v1/suggestion`);
  }

  findById(id: any): Observable<Suggestion> {
    return this.http.get<Suggestion>(`${Config.webApiUrl}/v1/suggestion/${id}`);
  }

  create(suggestion: Suggestion): Observable<Suggestion> {
    return this.http.post<Suggestion>(
      `${Config.webApiUrl}/v1/suggestion`,
      suggestion
    );
  }

  update(id: string, suggestion: Suggestion): Observable<Suggestion> {
    return this.http.put<Suggestion>(
      `${Config.webApiUrl}/v1/suggestion/${id}`,
      suggestion
    );
  }
}
