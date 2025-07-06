import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthStateService {
  private rolesSubject = new BehaviorSubject<any[]>([]);
  roles$ = this.rolesSubject.asObservable();

  // TODO: criar store para compartilhar as roles em todo projeto
}
