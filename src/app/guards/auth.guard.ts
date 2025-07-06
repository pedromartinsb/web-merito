import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

interface RoleResponse {
  name: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toast: ToastrService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isTokenValid()) {
      this.toast.info("O seu tempo para acessar acabou, por favor faça o login novamente.");
      this.router.navigate(["/sign-in"]);
      return false;
    }

    const requiredRoles = route.data["roles"] as Array<string>;
    if (requiredRoles && requiredRoles.length > 0) {
      const userRoles: RoleResponse[] = this.authService.getUserRoles();

      const userRoleNames = userRoles.map((r) => r.name);

      // Verifica se o usuário tem pelo menos uma das roles necessárias
      const hasPermission = requiredRoles.some((role) => userRoleNames.includes(role));
      if (!hasPermission) {
        this.toast.error("Você não tem permissão para acessar ou a página não existe.");
        // this.router.navigate(["/access-denied"]); // ou alguma página de erro/permissão

        this.router.navigate(["/home"]); // ou alguma página de erro/permissão
        return false;
      }
    }

    return true;
  }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   let authenticated = this.authService.isAuthenticated();

  //   if (authenticated) {
  //     const userRoles = this.authService.getRoles();
  //     var roleExists = false;
  //     var roleArray = new Array();
  //     roleArray.push(route.data.role);
  //     roleArray.forEach((role: any) => {
  //       role.forEach((element: any) => {
  //         if (userRoles == element) {
  //           roleExists = true;
  //         }
  //       });
  //     });

  //     if (!roleExists) {
  //       this.router.navigate(["/home"]);
  //       this.toast.error("Você não tem permissão para acessar ou a página não existe.");
  //       return false;
  //     }
  //     return true;
  //   } else {
  //     this.toast.error("Usuário não está logado no sistema.");
  //     this.router.navigate(["sign-in"]);
  //     return false;
  //   }
  // }

  checkIsAdmin(): boolean {
    this.isAdmin = false;
    const userRole = this.authService.getUserRoles();
    userRole.forEach((role) => {
      if (role.name === "ROLE_ADMIN") {
        this.isAdmin = true;
      }
    });
    return this.isAdmin;
  }
}
