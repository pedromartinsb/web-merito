import { CompanyService } from './../../../services/company.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { HoldingService } from './../../../services/holding.service';
import { Router } from '@angular/router';
import { Holding } from './../../../models/holding';
import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company';

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.css']
})
export class CompanyCreateComponent implements OnInit {

  holdings: Holding[] = [];

  company: Company = {
    name: '',
    companyType: 0,
    holdingId: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  name:        FormControl = new FormControl(null, Validators.minLength(3));
  holding:     FormControl = new FormControl(null, [Validators.required]);
  companyType: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private companyService: CompanyService,
    private holdingService: HoldingService,
    private router: Router,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.findAllHolding();
  }

  create(): void {
    this.companyService.create(this.company).subscribe({
      next: () => {
        this.toast.success('Empresa cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['company']);
      },
      error: (ex) => {
        if(ex.error.errors) {
          ex.error.errors.forEach(element => {
            this.toast.error(element.message);
          });
        } else {
          this.toast.error(ex.error.message);
        }
      },
    });
  }

  findAllHolding(): void {
    this.holdingService.findAll().subscribe(response => {
      this.holdings = response;
    });
  }

  validateFields(): boolean {
    return this.name.valid;
  }

}
