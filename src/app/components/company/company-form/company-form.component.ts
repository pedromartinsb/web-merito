import { CompanyService } from '../../../services/company.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { HoldingService } from '../../../services/holding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Holding } from '../../../models/holding';
import { Component, OnInit } from '@angular/core';
import { Company, CompanyType } from 'src/app/models/company';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  holdings: Holding[] = [];

  company: Company = {
    name: '',
    companyType: 'HEADQUARTERS',
    holdingId: '',
    holding: null,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  companyId: string;

  name:        FormControl = new FormControl(null, Validators.minLength(3));
  holding:     FormControl = new FormControl(null, [Validators.required]);
  companyType: FormControl = new FormControl(null, [Validators.required]);

  companyTypeLabels = [
    {label: "Matriz", value: "HEADQUARTERS"},
    {label: "Filial", value: "FILIAL"},
  ];

  constructor(
    private companyService: CompanyService,
    private holdingService: HoldingService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.params['id'];
    if (this.companyId) {
      this.loadCompany();
    } else {
      this.findAllHolding();
    }
  }

  findAllHolding(): void {
    this.holdingService.findAll().subscribe((response: Holding[]) => {
      this.holdings = response;
      if(this.companyId) {
        this.holding.setValue(response.find(h => h.id === this.company.holding.id));
        this.company.holdingId = this.company.holding.id;
      }
    });    
  }

  loadCompany(): void {
    this.companyService.findById(this.companyId).pipe(
      finalize(() => {
        this.findAllHolding();
        this.companyType.setValue(this.company.companyType);
      })
    ).subscribe((response: Company) => {
      this.company = response;       
    });
  }

  openCompanyForm(): void {
    if (this.companyId) {
      this.updateCompany();
    } else {
      this.createCompany();
    }
  }
  
  private createCompany(): void {
    this.companyService.create(this.company).subscribe({
      next: () => {
        this.toast.success('Empresa cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['company']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateCompany(): void {
    this.companyService.update(this.companyId, this.company).subscribe({
      next: () => {
        this.toast.success('Empresa atualizada com sucesso', 'Atualização');
        this.router.navigate(['company']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach(element => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  validateFields(): boolean {
    return this.name.valid;
  }

  selectHolding() {
    if (this.company.holding && this.company.holding.id) this.company.holdingId = this.company.holding.id;
  }

}
