import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.router.navigate(['home']);
  }

  logout() {
    this.authService.logout();
    this.storageService.clean();
    this.toast.info('Logout realizado com sucesso', 'Logout');
    this.router.navigate(['login']);
  }

  // checkRoleAccess(): void {
  //   const userRole = this.authService.getRole();

  //   if(this.route.data.indexOf(userRole) === -1) {
  //     this.canAccess = false;
  //   }
  // }
}
