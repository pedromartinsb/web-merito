import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { environment } from "src/environments/environment";

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

enum UserRole {
  ADMIN = "ROLE_ADMIN",
  SUPERVISOR = "ROLE_SUPERVISOR",
  MANAGER = "ROLE_MANAGER",
  USER = "ROLE_USER",
}

interface RoleResponse {
  name: string;
}

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  navItems: NavItem[] = [];

  isMenuOpen = false;
  isAdmin = false;
  isSupervisor = false;
  isManager = false;
  isUser = false;
  isDropdownOpen = false;
  isStaging = !environment.production;

  personName = "";
  personRole = "";
  personPicture = "";
  currentTime = "";

  userRoles: RoleResponse[];

  private destroyed$ = new Subject<void>();
  private intervalId: any;

  private readonly roleNavMap: Record<UserRole, NavItem[]> = {
    [UserRole.ADMIN]: [
      // { label: "Home", icon: "fas fa-home", route: "/home" },
      // { label: "Funcionários", icon: "fas fa-users", route: "/employees" },
      // { label: "Profissionais", icon: "fas fa-user-tie", route: "/professionals" },
      // { label: "Fornecedores", icon: "fas fa-truck-field", route: "/suppliers" },
      // { label: "Cargos", icon: "fas fa-suitcase", route: "/responsibilities" },
      // { label: "Rotinas", icon: "fas fa-list-check", route: "/routines" },
      // { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" },

      { label: "Início", icon: "fas fa-home", route: "/inicio/gerente" },
      { label: "Funcionários", icon: "fas fa-users", route: "/funcionarios" },
      { label: "Profissionais Autônomos", icon: "fas fa-user-tie", route: "/profissionais-autonomos" },
      { label: "Prestadores de Serviço", icon: "fas fa-truck-field", route: "/prestadores-de-servico" },
      { label: "Cargos", icon: "fas fa-suitcase", route: "/responsibilities" },
      { label: "Rotinas", icon: "fas fa-list-check", route: "/routines" },
      { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" },
    ],
    [UserRole.MANAGER]: [
      // { label: "Home", icon: "fas fa-home", route: "/home" },
      // { label: "Funcionários", icon: "fas fa-users", route: "/employees" },
      // { label: "Profissionais", icon: "fas fa-user-tie", route: "/professionals" },
      // { label: "Fornecedores", icon: "fas fa-truck-field", route: "/suppliers" },
      // { label: "Tarefas", icon: "fas fa-list-check", route: "/tasks" },
      // { label: "Metas", icon: "fas fa-bullseye", route: "/goals" },

      { label: "Início", icon: "fas fa-home", route: "/inicio/gerente" },
      { label: "Funcionários", icon: "fas fa-users", route: "/funcionarios" },
      { label: "Profissionais Autônomos", icon: "fas fa-user-tie", route: "/profissionais-autonomos" },
      { label: "Prestadores de Serviço", icon: "fas fa-truck-field", route: "/prestadores-de-servico" },
      { label: "Tarefas", icon: "fas fa-list-check", route: "/tarefas" },
      { label: "Metas", icon: "fas fa-bullseye", route: "/metas/gerente" },
      { label: "Documentos", icon: "fas fa-folder-open", route: "/documentos/gerente" },
      { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" },
    ],
    [UserRole.SUPERVISOR]: [
      // { label: "Home", icon: "fas fa-home", route: "/home" },
      // { label: "Funcionários", icon: "fas fa-users", route: "/employees" },
      // { label: "Profissionais", icon: "fas fa-user-tie", route: "/professionals" },
      // { label: "Fornecedores", icon: "fas fa-truck-field", route: "/suppliers" },
      // { label: "Tarefas", icon: "fas fa-list-check", route: "/tasks" },
      // { label: "Metas", icon: "fas fa-bullseye", route: "/goals" },
      // { label: "Documentos", icon: "fas fa-folder-open", route: "/documents" },
      // { label: "Relatórios", icon: "fas fa-chart-pie", route: "/reports" },
      // { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" },

      { label: "Início", icon: "fas fa-home", route: "/inicio/gerente" },
      { label: "Funcionários", icon: "fas fa-users", route: "/funcionarios" },
      { label: "Profissionais Autônomos", icon: "fas fa-user-tie", route: "/profissionais-autonomos" },
      { label: "Prestadores de Serviço", icon: "fas fa-truck-field", route: "/prestadores-de-servico" },
      { label: "Tarefas", icon: "fas fa-list-check", route: "/tarefas" },
      { label: "Metas", icon: "fas fa-bullseye", route: "/metas/gerente" },
      { label: "Documentos", icon: "fas fa-folder-open", route: "/documentos/gerente" },
      { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" },
    ],
    [UserRole.USER]: [
      // { label: "Home", icon: "fas fa-home", route: "/home" },
      // { label: "Minhas Rotinas", icon: "fas fa-chart-line", route: "/routines" },
      // { label: "Minhas Tarefas", icon: "fas fa-list-check", route: "/tasks" },
      // { label: "Minhas Metas", icon: "fas fa-users", route: "/goals" },
      // { label: "Documentos", icon: "fas fa-folder-open", route: "/documents" },
      // { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" },

      { label: "Início", icon: "fas fa-home", route: "/inicio/usuario" },
      { label: "Minhas Rotinas", icon: "fas fa-chart-line", route: "/routines" },
      { label: "Minhas Tarefas", icon: "fas fa-list-check", route: "/tarefas" },
      { label: "Minhas Metas", icon: "fas fa-bullseye", route: "/metas/usuario" },
      { label: "Documentos", icon: "fas fa-folder-open", route: "/documentos/usuario" },
      { label: "Configurações", icon: "fas fa-user-gear", route: "/change-password" },
    ],
  };

  constructor(private authService: AuthService, private toast: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.userRoles = this.loadUserRoles();
    this.personName = this.loadUserName() || "";
    this.personPicture = this.loadUserPhoto() || "";

    this.checkPermission();
    this.startClock();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private loadUserRoles(): RoleResponse[] {
    return this.authService.getUserRoles();
  }

  private loadUserName(): string {
    return this.authService.getCurrentUserName();
  }

  private loadUserPhoto(): string {
    return this.authService.getCurrentUserPhoto();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenuOnNavigate(): void {
    if (window.innerWidth <= 768) {
      this.isMenuOpen = false;
    }
  }

  @HostListener("window:resize", [])
  onResize() {
    if (window.innerWidth > 768) {
      this.isMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.toast.success("Logout realizado com sucesso", "Logout");
    this.router.navigate(["/sign-in"]);
  }

  private startClock(): void {
    this.updateCurrentTime();
    this.intervalId = setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
  }

  private updateCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  private checkPermission(): void {
    this.userRoles.forEach((role) => {
      switch (role.name) {
        case UserRole.ADMIN:
          this.isAdmin = true;
          this.personRole = "Administrador";
          this.generateNavItems(UserRole.ADMIN);
          break;
        case UserRole.SUPERVISOR:
          this.isSupervisor = true;
          this.personRole = "Supervisor";
          this.generateNavItems(UserRole.SUPERVISOR);
          break;
        case UserRole.MANAGER:
          this.isManager = true;
          this.personRole = "Gerente";
          this.generateNavItems(UserRole.MANAGER);
          break;
        case UserRole.USER:
          this.isUser = true;
          this.personRole = "Usuário";
          this.generateNavItems(UserRole.USER);
          break;
      }
    });
  }

  private generateNavItems(role: UserRole): void {
    this.clearNavItems();
    const items = this.roleNavMap[role];
    if (items) {
      this.navItems.push(...items);
    }
  }

  private clearNavItems(): void {
    this.navItems = [];
  }

  private handleErrors(ex: any): void {
    if (ex.error?.errors) {
      ex.error.errors.forEach((element: { message: string }) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error?.message || "Erro inesperado");
    }
  }
}
