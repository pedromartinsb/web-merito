import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map, Observable } from "rxjs";
import { Config } from "../config/api.config";
import { jwtDecode } from "jwt-decode";
import { Router } from "@angular/router";

interface JwtPayload {
  exp: number;
  roles: RoleResponse[];
}

interface LoginResponse {
  token: string;
}

interface UserProfileResponseDTO {
  id: string;
  username: string;
  email: string;
  firstAccess: boolean;
  roles: any[];
  office: string;
}

interface RoleResponse {
  name: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  roleAs: string[] = [];

  jwtService: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string, rememberMe: boolean): Observable<string> {
    return this.http
      .post<LoginResponse>(`${Config.webApiUrl}/v1/auth/login`, { username, password, rememberMe })
      .pipe(map((response) => response.token));
  }

  getToken(): string | null {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now().valueOf() / 1000;
      if (decoded.exp < now) {
        return false; // token expirado
      }
      return true;
    } catch {
      return false; // token inválido ou mal formado
    }
  }

  getCurrentUser(): Observable<UserProfileResponseDTO> {
    return this.http.get<UserProfileResponseDTO>(`${Config.webApiUrl}/v1/auth/me`);
  }

  setCurrentUser(user: UserProfileResponseDTO): void {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  removePropertyFromCurrentUser(prop: keyof UserProfileResponseDTO): void {
    const userString = localStorage.getItem("currentUser");
    if (!userString) return;

    const user: UserProfileResponseDTO = JSON.parse(userString);
    delete user[prop]; // Remove a propriedade

    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  setCurrentCompanyIdToCurrentUser(currentCompanyId: string): void {
    const currentUserString = localStorage.getItem("currentUser");
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      currentUser.currentCompanyId = currentCompanyId;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.http.delete(`${Config.webApiUrl}/v1/auth/sign-out`);
    this.router.navigate(["/sign-in"]);
  }

  getRole(): string[] {
    this.roleAs = JSON.parse(localStorage.getItem("role"));
    return this.roleAs;
  }

  getUserRoles(): RoleResponse[] {
    const currentUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!currentUser) {
      return [];
    }
    try {
      const userObj = JSON.parse(currentUser);
      return userObj.roles || [];
    } catch {
      return [];
    }
  }

  // FIXME: pensar numa maneira de unificar esses métodos abaixo
  getCurrentUserId(): string {
    const currentUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!currentUser) {
      return "";
    }
    try {
      const userObj = JSON.parse(currentUser);
      return userObj.id || "";
    } catch {
      return "";
    }
  }

  getCurrentUserName(): string {
    const currentUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!currentUser) {
      return "";
    }
    try {
      const userObj = JSON.parse(currentUser);
      return userObj.name || "";
    } catch {
      return "";
    }
  }

  getCurrentUserPhoto(): string {
    const currentUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (!currentUser) {
      return "";
    }
    try {
      const userObj = JSON.parse(currentUser);
      return userObj.photo || "";
    } catch {
      return "";
    }
  }
}
