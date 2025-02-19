// company-selected.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { CompanyService } from "./company.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class CompanySelectedGuard implements CanActivate {
  constructor(private companyService: CompanyService, private router: Router, private toast: ToastrService) {}

  canActivate(): boolean {
    if (localStorage.getItem("officeId")) {
      return true;
    }

    // Se nenhuma empresa foi selecionada, redireciona para a tela de seleção
    this.toast.warning("Você precisa selecionar uma empresa para continuar.");
    this.router.navigate(["/select-company"]);
    return false;
  }
}
