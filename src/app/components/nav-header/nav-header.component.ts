import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-nav-header",
  templateUrl: "./nav-header.component.html",
  styleUrls: ["./nav-header.component.scss"],
})
export class NavHeaderComponent {
  // Dados fictícios do usuário logado
  user = {
    name: "João Silva",
    photo: "https://via.placeholder.com/40",
  };

  constructor(private router: Router) {}

  logout(): void {
    // Adicione aqui sua lógica de logout, como limpar tokens, etc.
    this.router.navigate(["/login"]);
  }
}
