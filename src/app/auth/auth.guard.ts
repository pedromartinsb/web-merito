import { StorageService } from './../services/storage.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let authenticated = this.storageService.isLoggedIn();

    if(authenticated) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false
    }
  }

}
