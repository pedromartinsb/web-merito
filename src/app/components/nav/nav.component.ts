import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  @Input() inputSideNav: MatSidenav;
  @Input() inputLogout: InputEvent;

  userRole: string[] = [];
  canAdminAccess: boolean = false;
  canModeratorAccess: boolean = false;
  canUserAccess: boolean = false;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.checkAdminAccess();
    this.checkModeratorAccess();
    this.checkUserAccess();
    this.router.navigate(['home']);
  }

  logout() {
    this.authService.logout();
    this.storageService.clean();
    this.toast.info('Logout realizado com sucesso', 'Logout');
    this.router.navigate(['login']);
  }

  checkAdminAccess(): void {
    if (this.userRole.includes('ROLE_ADMIN')) {
      this.canAdminAccess = true;
    } else {
      this.canAdminAccess = false;
    }
  }

  checkModeratorAccess(): void {
    if (this.userRole.includes('ROLE_MODERATOR')) {
      this.canModeratorAccess = true;
    } else {
      this.canModeratorAccess = false;
    }
  }

  checkUserAccess(): void {
    if (this.userRole.includes('ROLE_USER')) {
      this.canUserAccess = true;
    } else {
      this.canUserAccess = false;
    }
  }
}
