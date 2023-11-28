import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkUserLogin(route, state);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getRole();
      var roleArray = new Array();
      roleArray.push(route.data.role);

      var roleExists = false;
      roleArray.forEach(role => {
        if (userRole.includes(role)) {
          roleExists = true;
        }
      })

      if (!roleExists) {
        this.router.navigate(['/home']);
        this.toast.error('Você não tem permissão para acessar essa página.');
        return false;
      }
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }

}
