import { ToastrService } from 'ngx-toastr';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { PersonService } from 'src/app/services/person.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { OfficeResponse } from 'src/app/models/office';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  @Input() inputSideNav: MatSidenav;
  @Input() inputLogout: InputEvent;
  destroyed = new Subject<void>();
  modeNavMenu: MatDrawerMode = 'over';
  showFiller = false;
  userRole: string[] = [];
  canAdminAccess: boolean = false;
  canModeratorAccess: boolean = false;
  canUserAccess: boolean = false;
  currentScreenSize: string;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  isAdmin: boolean = false;
  isAdminGeral: boolean = false;
  isAdminEmpresa: boolean = false;
  isAdminOffice: boolean = false;
  isUserOffice: boolean = false;
  isGuest: boolean = false;
  personName: string;
  personPicture: string;
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';
  firstOffice: OfficeResponse;
  officeResponses: OfficeResponse[] = [];

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
    private personService: PersonService,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            if (
              this.displayNameMap.get(query) === 'Small' ||
              this.displayNameMap.get(query) === 'XSmall'
            ) {
              this.currentScreenSize = this.displayNameMap.get(query);
              this.modeNavMenu = 'over';
            }
          }
        }
      });
  }

  ngOnInit(): void {
    this.officeResponses = JSON.parse(localStorage.getItem('officeResponses'));
    var officeId = localStorage.getItem('officeId');
    this.firstOffice = this.officeResponses.filter((o) => o.id === officeId)[0];
    this.userRole = this.authService.getRole();
    this.personService.findByRequest().subscribe((person) => {
      this.personName = person.name;
      if (person.picture != null) {
        this.personPicture = this.s3Url + person.picture;
      } else {
        this.personPicture =
          'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png';
      }
    });
    this.checkPermission();
    this.checkAdminAccess();
    this.checkModeratorAccess();
    this.checkUserAccess();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private checkPermission(): void {
    this.userRole.map((role) => {
      switch (role) {
        case 'ROLE_ADMIN':
          this.isAdmin = true;
          break;
        case 'ROLE_ADMIN_GERAL':
          this.isAdminGeral = true;
          break;
        case 'ROLE_ADMIN_COMPANY':
          this.isAdminEmpresa = true;
          break;
        case 'ROLE_ADMIN_OFFICE':
          this.isAdminOffice = true;
          break;
        case 'ROLE_USER_OFFICE':
          this.isUserOffice = true;
          break;
        default:
          this.isGuest = true;
          break;
      }
    });
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

  openMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.openMenu();
  }

  buttonLeave(menuTrigger: MatMenuTrigger) {
    if (menuTrigger.menuOpened) {
      setTimeout(() => {
        menuTrigger.closeMenu();
      }, 1000);
    }
  }

  changeCurrentOffice(element: OfficeResponse) {
    this.firstOffice = element;
    localStorage.setItem('officeId', element.id);
    window.location.reload();
  }
}
