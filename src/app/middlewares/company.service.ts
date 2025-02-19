// company.service.ts
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CompanyService {
  private selectedCompany: any = null;

  // Chamada quando o usuário seleciona uma empresa
  selectCompany(company: any): void {
    this.selectedCompany = company;
  }

  // Verifica se há uma empresa selecionada
  isCompanySelected(): boolean {
    return this.selectedCompany !== null;
  }

  // Retorna a empresa selecionada
  getSelectedCompany(): any {
    return this.selectedCompany;
  }
}
