import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/person';
import { Config } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${Config.webApiUrl}/v1/user`);
  }

  addPermissions(
    id: string,
    userResponse: UserResponse
  ): Observable<UserResponse> {
    return this.http.put<UserResponse>(
      `${Config.webApiUrl}/v1/user/${id}`,
      userResponse
    );
  }
}
