import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { OfficeSelectedGuard } from "./office-selected.guard";

@Injectable({
  providedIn: "root",
})
export class CombinedGuard implements CanActivate {
  constructor(private authGuard: AuthGuard, private officeSelectedGuard: OfficeSelectedGuard, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const isAuth = await Promise.resolve(this.authGuard.canActivate(route));
    const isOfficeSelected = await Promise.resolve(this.officeSelectedGuard.canActivate());

    if (!isAuth && !isOfficeSelected) {
      // Opcional: redirecionamento caso falhe
      this.router.navigate(["/access-denied"]);
      return false;
    }

    return true;
  }
}
