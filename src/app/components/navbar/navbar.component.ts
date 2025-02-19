import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { OfficeResponse } from "src/app/models/office";
import { AuthService } from "src/app/services/auth.service";
import { StorageService } from "src/app/services/storage.service";
import { environment } from "src/environments/environment";

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  // Exemplo de itens de navegação
  navItems: NavItem[] = [];

  // Dados fictícios do usuário logado
  user = {
    name: "João Silva",
    photo: "https://via.placeholder.com/40",
  };

  isMenuOpen: boolean = false;
  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  isManager: boolean = false;
  isUser: boolean = false;
  isDropdownOpen = false;
  isStaging: boolean = true;
  destroyed = new Subject<void>();
  userRole: string[] = [];
  personName: string;
  personRole: string;
  personPicture: string;
  currentTime: string;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.personName = localStorage.getItem("personName") ? localStorage.getItem("personName") : "";
    this.personPicture = localStorage.getItem("personPicture");

    this._checkPermission();
    this._isStaging();

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
    this.currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private _checkPermission(): void {
    this.userRole.map((role) => {
      switch (role) {
        case "ROLE_ADMIN":
          this.isAdmin = true;
          this.personRole = "Administrador";
          this._createAdminNavItems();
          break;
        case "ROLE_SUPERVISOR":
          this.isSupervisor = true;
          this.personRole = "Supervisor";
          this._createSupervisorNavItems();
          break;
        case "ROLE_MANAGER":
          this.isManager = true;
          this.personRole = "Gerente";
          this._createManagerNavItems();
          break;
        case "ROLE_USER":
          this.isUser = true;
          this.personRole = "Usuário";
          this._createUserNavItems();
          break;
      }
    });
  }

  private _createAdminNavItems() {
    this._cleanNavItems();
    this.navItems.push(
      { label: "Home", icon: "fas fa-home", route: "/home" },
      { label: "Funcionários", icon: "fas fa-users", route: "/employees" },
      { label: "Profissionais", icon: "fas fa-user-tie", route: "/professionals" },
      { label: "Fornecedores", icon: "fas fa-truck-field", route: "/suppliers" },
      { label: "Cargos", icon: "fas fa-suitcase", route: "/responsibilities" },
      { label: "Rotinas", icon: "fas fa-list-check", route: "/routines" },
      { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" }
    );
  }

  private _createManagerNavItems() {
    this._cleanNavItems();
    this.navItems.push(
      { label: "Home", icon: "fas fa-home", route: "/home" },
      { label: "Funcionários", icon: "fas fa-users", route: "/employees" },
      { label: "Profissionais", icon: "fas fa-user-tie", route: "/professionals" },
      { label: "Fornecedores", icon: "fas fa-truck-field", route: "/suppliers" },
      { label: "Tarefas", icon: "fas fa-list-check", route: "/tasks" },
      { label: "Metas", icon: "fas fa-bullseye", route: "/goals" },
      { label: "Dashboards", icon: "fas fa-tachometer-alt", route: "/dashboards" },
      { label: "Documentos", icon: "fas fa-folder-open", route: "/documents" },
      { label: "Relatórios", icon: "fas fa-chart-pie", route: "/reports" },
      { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" },
      { label: "Chat", icon: "fas fa-comments", route: "/chat" }
    );
  }

  private _createSupervisorNavItems() {
    this._cleanNavItems();
    this.navItems.push(
      { label: "Home", icon: "fas fa-home", route: "/home" },
      { label: "Funcionários", icon: "fas fa-users", route: "/employees" },
      { label: "Profissionais", icon: "fas fa-user-tie", route: "/professionals" },
      { label: "Fornecedores", icon: "fas fa-truck-field", route: "/suppliers" },
      { label: "Tarefas", icon: "fas fa-list-check", route: "/tasks" },
      { label: "Metas", icon: "fas fa-bullseye", route: "/goals" },
      { label: "Dashboards", icon: "fas fa-tachometer-alt", route: "/dashboards" },
      { label: "Documentos", icon: "fas fa-folder-open", route: "/documents" },
      { label: "Relatórios", icon: "fas fa-chart-pie", route: "/reports" },
      { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" },
      { label: "Chat", icon: "fas fa-comments", route: "/chat" }
    );
  }

  private _createUserNavItems() {
    this._cleanNavItems();
    this.navItems.push(
      { label: "Home", icon: "fas fa-home", route: "/home" },
      { label: "Minhas Rotinas", icon: "fas fa-chart-line", route: "/routines" },
      { label: "Minhas Tarefas", icon: "fas fa-list-check", route: "/tasks" },
      { label: "Minhas Metas", icon: "fas fa-users", route: "/goals" },
      { label: "Documentos", icon: "fas fa-folder-open", route: "/documents" },
      { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" },
      { label: "Chat", icon: "fas fa-comments", route: "/chat" }
    );
  }

  private _cleanNavItems() {
    this.navItems = [];
  }

  private _isStaging() {
    if (environment.production) {
      this.isStaging = false;
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.clean();
        this.toast.info("Logout realizado com sucesso", "Logout");
        this.router.navigate(["/sign-in"]);
      },
      error: (ex: any) => {
        this._handleErrors(ex);
      },
    });
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element: { message: string }) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }
}
