import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../services/auth.service';
import {StorageService} from '../../services/storage.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDrawerMode, MatSidenav} from '@angular/material/sidenav';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject, takeUntil} from 'rxjs';
import {OfficeResponse} from 'src/app/models/office';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  @Input() inputSideNav: MatSidenav;
  @Input() inputLogout: InputEvent;
  destroyed = new Subject<void>();
  modeNavMenu: MatDrawerMode = 'side';
  userRole: string[] = [];
  currentScreenSize: string;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  isSidebarActive = false;

  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  isUser: boolean = false;
  isDropdownOpen = false;

  personName: string;
  personRole: string;
  personPicture: string;
  firstOffice: OfficeResponse;
  officeResponses: OfficeResponse[] = [];
  currentTime: string;

  chatOpen = false;
  messages = [
    { content: 'Olá! Como posso ajudar?', sent: false },
    { content: 'Olá! Preciso de suporte.', sent: true }
  ];
  newMessage = '';

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
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
              this.modeNavMenu = 'side';
            }
          }
        }
      });
  }

  ngOnInit(): void {
    this.officeResponses = JSON.parse(localStorage.getItem('officeResponses'));
    const officeId = localStorage.getItem('officeId');
    this.firstOffice = this.officeResponses.filter((o) => o.id === officeId)[0];
    this.userRole = this.authService.getRole();
    this.personName = localStorage.getItem('personName');
    this.personPicture = localStorage.getItem('personPicture');

    this.checkPermission();

    this.updateCurrentTime();
    setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  updateCurrentTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  private checkPermission(): void {
    this.userRole.map((role) => {
      switch (role) {
        case 'ROLE_ADMIN':
          this.isAdmin = true;
          this.personRole = "Administrador";
          break;
        case 'ROLE_SUPERVISOR':
          this.isSupervisor = true;
          this.personRole = "Supervisor";
          break;
        case 'ROLE_USER':
          this.isUser = true;
          this.personRole = "Usuário";
          break;
      }
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.clean();
        this.toast.info('Logout realizado com sucesso', 'Logout');
        this.router.navigate(['login']);
      },
      error: (ex: any) => {
        this._handleErrors(ex);
      },
    });
  }

  changeCurrentOffice(element: OfficeResponse) {
    this.firstOffice = element;
    localStorage.setItem('officeId', element.id);
    window.location.reload();
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ content: this.newMessage, sent: true });
      this.newMessage = '';
      setTimeout(() => {
        this.messages.push({ content: 'Resposta automática', sent: false });
      }, 1000);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element: { message: string; }) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }
}
