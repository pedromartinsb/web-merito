import { Component } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

interface Company {
  id: string;
  name: string;
}

@Component({
  selector: "app-select-company",
  templateUrl: "./select-company.component.html",
  styleUrls: ["./select-company.component.scss"],
})
export class SelectCompanyComponent {
  companies: Company[] = [];

  selectedCompanyId: string | null = null;
  errorMessage: string = "";

  constructor(private router: Router) {
    const companiesResponses = JSON.parse(localStorage.getItem("officeResponses"));
    companiesResponses.forEach((response: any) => {
      const company: Company = {
        id: response.id,
        name: response.fantasyName,
      };
      this.companies.push(company);
    });
  }

  onSelect(companyId: string): void {
    this.selectedCompanyId = companyId;
    localStorage.setItem("officeId", companyId);
    this.errorMessage = "";
  }

  proceed(): void {
    if (this.selectedCompanyId === null) {
      this.errorMessage = "Selecione uma empresa para avançar.";
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Login efetuado com sucesso!",
      backdrop: `
                  rgba(77,77,77,0.4)
                  left top
                  no-repeat
                `,
    });

    // Navegue para a tela home e passe o ID da empresa selecionada, se necessário
    this.router.navigate(["/home"]);
  }
}
