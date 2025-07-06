import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class OfficeSelectedGuard implements CanActivate {
  constructor(private router: Router, private toast: ToastrService) {}

  canActivate(): boolean {
    const currentUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");

    const user = JSON.parse(currentUser);
    if (!user.currentCompanyId || user.currentCompanyId === "") {
      // Se nenhuma empresa foi selecionada, redireciona para a tela de seleção
      this.toast.warning("Você precisa selecionar uma empresa para continuar.");
      this.router.navigate(["/select-company"]);
      return false;
    }

    return true;
  }
}
