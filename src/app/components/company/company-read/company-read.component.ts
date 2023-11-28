import { ToastrService } from 'ngx-toastr';
import { CompanyService } from './../../../services/company.service';
import { Company } from 'src/app/models/company';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-read',
  templateUrl: './company-read.component.html',
  styleUrls: ['./company-read.component.css']
})
export class CompanyReadComponent implements OnInit {

  company: Company = {
    name: '',
    companyType: 0,
    holdingId: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  constructor(
    private companyService: CompanyService,
    private toast:    ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.company.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.companyService.findById(this.company.id).subscribe({
      next: response => {
        this.company = response;
      },
      error: () => {
        this.toast.error("Não foi possível buscar a Empresa, tente mais tarde.")
      }
    })
  }

}
