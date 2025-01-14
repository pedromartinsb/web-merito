import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let authenticated = this.authService.isAuthenticated();

    if (authenticated) {
      const userRole = this.authService.getRole();
      var roleExists = false;
      var roleArray = new Array();
      roleArray.push(route.data.role);
      roleArray.forEach((role: any) => {
        role.forEach((element: any) => {
          if (userRole == element) {
            roleExists = true;
          }
        });
      });

      if (!roleExists) {
        this.router.navigate(['/home']);
        this.toast.error('Você não tem permissão para acessar ou a página não existe.');
        return false;
      }
      return true;

    } else {
      this.toast.error('Usuário não está logado no sistema.');
      this.router.navigate(['login']);
      return false;
    }
  }

  checkIsAdmin(): boolean {
    this.isAdmin = false;
    const userRole = this.authService.getRole();
    userRole.forEach((role) => {
      if (role === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
    return this.isAdmin;
  }
}
