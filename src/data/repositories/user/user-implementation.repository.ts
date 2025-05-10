import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { UserModel } from "src/domain/models/user.model";
import { UserRepository } from "src/domain/repositories/user.repository";
import { UserImplementationRepositoryMapper } from "./mappers/user-repository.mapper";
import { HttpClient } from "@angular/common/http";
import { UserEntity } from "./entities/user-entity";

@Injectable({
  providedIn: "root",
})
export class UserImplementationRepository extends UserRepository {
  userMapper = new UserImplementationRepositoryMapper();

  constructor(private http: HttpClient) {
    super();
  }

  login(params: { username: string; password: string }): Observable<UserModel> {
    return this.http.post<UserEntity>("http://localhost:8080", { params }).pipe(map(this.userMapper.mapFrom));
  }
  register(params: { phoneNum: string; password: string }): Observable<UserModel> {
    return this.http.post<UserEntity>("https://example.com/register", { params }).pipe(map(this.userMapper.mapFrom));
  }
  getUserProfile(): Observable<UserModel> {
    return this.http.get<UserEntity>("https://example.com/user").pipe(map(this.userMapper.mapFrom));
  }
}
