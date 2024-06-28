import { CompanyService } from '../../../services/company.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { HoldingService } from '../../../services/holding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Holding } from '../../../models/holding';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Address,
  AddressSearch,
  Company,
  Contact,
} from 'src/app/models/company';
import { finalize } from 'rxjs';
import { Person } from 'src/app/models/person';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PersonService } from 'src/app/services/person.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'],
})
export class CompanyFormComponent implements OnInit {
  holdings: Holding[] = [];

  address: Address = {
    cep: '',
    streetName: '',
    neighborhood: '',
    city: '',
    uf: '',
    complement: '',
  };

  contact: Contact = {
    phone: '',
    cellphone: '',
  };

  company: Company = {
    fantasyName: '',
    corporateReason: '',
    cnpj: '',
    identifier: '',
    email: '',
    website: '',
    contact: this.contact,
    address: this.address,
    companyType: 'HEADQUARTERS',
    holdingId: '',
    holding: null,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  companyId: string;

  fantasyName: FormControl = new FormControl(null, Validators.minLength(3));
  corporateReason: FormControl = new FormControl(null, Validators.minLength(3));
  cnpj: FormControl = new FormControl(null, [
    Validators.maxLength(14),
    Validators.required,
  ]);
  identifier: FormControl = new FormControl(null, Validators.minLength(3));
  email: FormControl = new FormControl();
  website: FormControl = new FormControl();
  holding: FormControl = new FormControl(null, [Validators.required]);
  companyType: FormControl = new FormControl(null, [Validators.required]);

  // Contact
  phone: FormControl = new FormControl();
  cellphone: FormControl = new FormControl();

  // Address
  cep: FormControl = new FormControl();
  streetName: FormControl = new FormControl();
  neighborhood: FormControl = new FormControl();
  city: FormControl = new FormControl();
  uf: FormControl = new FormControl();
  complement: FormControl = new FormControl();

  companyTypeLabels = [
    { label: 'Matriz', value: 'HEADQUARTERS' },
    { label: 'Filial', value: 'FILIAL' },
  ];

  PERSON_ELEMENT_DATA: Person[] = [];
  PERSON_FILTERED_DATA: Person[] = [];

  persons: Person[] = [];
  companyPersons: Person[] = [];

  personDisplayedColumns: string[] = [
    'personName',
    'personDepartment',
    'personType',
    'personActions',
  ];
  personDataSource = new MatTableDataSource<Person>(this.persons);

  DEPARTMENT_ELEMENT_DATA: Person[] = [];
  DEPARTMENT_FILTERED_DATA: Person[] = [];

  departmentDisplayedColumns: string[] = [
    'departmentName',
    'departmentActions',
  ];

  isSaving: boolean = false;

  @ViewChild('personPaginator') personPaginator: MatPaginator;

  constructor(
    private companyService: CompanyService,
    private holdingService: HoldingService,
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.companyId = this.route.snapshot.params['id'];
    if (this.companyId) {
      this.loadCompany();
    } else {
      this.loadList();
    }
    this.cep.valueChanges.subscribe((newCep: string) => {
      if (newCep && newCep.length === 8) {
        this.findAddress();
      }
    });
  }

  backClicked() {
    this._location.back();
  }

  ngAfterViewInit(): void {
    if (this.personPaginator) {
      this.personDataSource.paginator = this.personPaginator;
    }
  }

  loadList() {
    this.findAllHolding();
    this.findAllPersons();
  }

  findAllHolding(): void {
    this.holdingService.findAll().subscribe((response: Holding[]) => {
      this.holdings = response;
      if (this.companyId) {
        this.holding.setValue(
          response.find((h) => h.id === this.company.holding.id)
        );
        this.company.holdingId = this.company.holding.id;
      }
    });
  }

  loadCompany(): void {
    this.companyService
      .findById(this.companyId)
      .pipe(
        finalize(() => {
          this.findAllHolding();
          this.findCompanyPersons();
          this.companyType.setValue(this.company.companyType);
        })
      )
      .subscribe((response: Company) => {
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
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  validateFields(): boolean {
    return this.fantasyName.valid && this.corporateReason.valid;
  }

  selectHolding() {
    if (this.company.holding && this.company.holding.id)
      this.company.holdingId = this.company.holding.id;
  }

  findCompanyPersons() {
    this.personService
      // .findAllByCompany(this.company.id)
      .findAll()
      .subscribe((response: Person[]) => {
        this.companyPersons = response;
        this.personDataSource = new MatTableDataSource<Person>(response);
      });
  }

  findAllPersons() {
    this.personService.findAll().subscribe((response: Person[]) => {
      this.persons = response;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.personDataSource.filter = filterValue.trim().toLowerCase();
  }

  getPersonTypeLabel(personType: string) {
    if (personType === 'EMPLOYEE') {
      return 'Colaborador';
    }
    return '';
  }

  private findAddress() {
    if (this.cep.value.length === 8) {
      this.companyService
        .findAddress(this.cep.value)
        .subscribe((response: AddressSearch) => {
          if (response.cep && response.cep.length > 0) {
            this.fillAddress(response);
            this.toast.success(
              'Endereço encontrado com sucesso',
              'Atualização'
            );
          } else {
            this.toast.error('CEP não encontrado.');
          }
        });
    }
  }

  private fillAddress(addressSearch: AddressSearch) {
    const currentCep = this.cep.value;

    let newAddress: Address = {
      cep: currentCep,
      city: addressSearch.localidade,
      complement: addressSearch.complemento,
      neighborhood: addressSearch.bairro,
      streetName: addressSearch.logradouro,
      uf: addressSearch.uf,
    };

    this.city.patchValue(addressSearch.localidade);
    this.complement.patchValue(addressSearch.complemento);
    this.neighborhood.patchValue(addressSearch.bairro);
    this.streetName.patchValue(addressSearch.logradouro);
    this.uf.patchValue(addressSearch.uf);

    this.company.address = newAddress;
  }
}
