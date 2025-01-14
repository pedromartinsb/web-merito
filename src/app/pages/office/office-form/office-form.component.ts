import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Company } from 'src/app/models/company';
import { Address, AddressSearch, Contact, Office } from 'src/app/models/office';
import { CompanyService } from 'src/app/services/company.service';
import { OfficeService } from 'src/app/services/office.service';

@Component({
  selector: 'app-office-form',
  templateUrl: './office-form.component.html',
  styleUrls: ['./office-form.component.css'],
})
export class OfficeFormComponent implements OnInit {
  companies: Company[] = [];

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

  office: Office = {
    fantasyName: '',
    corporateReason: '',
    cnpj: '',
    identifier: '',
    email: '',
    website: '',
    contact: this.contact,
    address: this.address,
    companyId: '',
    company: null,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  officeId: string;

  fantasyName: FormControl = new FormControl(null, Validators.minLength(3));
  corporateReason: FormControl = new FormControl(null, Validators.minLength(3));
  cnpj: FormControl = new FormControl(null, [
    Validators.maxLength(14),
    Validators.required,
  ]);
  identifier: FormControl = new FormControl(null, Validators.minLength(3));
  email: FormControl = new FormControl();
  website: FormControl = new FormControl();
  company: FormControl = new FormControl(null, [Validators.required]);

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

  isSaving: boolean = false;

  constructor(
    private officeService: OfficeService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.officeId = this.route.snapshot.params['id'];
    if (this.officeId) {
      this.loadOffice();
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

  loadList() {
    this.findAllCompany();
  }

  findAllCompany(): void {
    this.companyService.findAll().subscribe((response: Company[]) => {
      this.companies = response;
      if (this.officeId) {
        this.company.setValue(
          response.find((h) => h.id === this.office.company.id)
        );
        this.office.companyId = this.office.company.id;
      }
    });
  }

  loadOffice(): void {
    this.officeService
      .findById(this.officeId)
      .pipe(
        finalize(() => {
          this.findAllCompany();
        })
      )
      .subscribe((response: Office) => {
        this.office = response;
      });
  }

  openOfficeForm(): void {
    if (this.officeId) {
      this.updateOffice();
    } else {
      this.createOffice();
    }
  }

  private createOffice(): void {
    this.officeService.create(this.office).subscribe({
      next: () => {
        this.toast.success('Unidade cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['office']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private updateOffice(): void {
    this.officeService.update(this.officeId, this.office).subscribe({
      next: () => {
        this.toast.success('Unidade atualizada com sucesso', 'Atualização');
        this.router.navigate(['office']);
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

  selectCompany() {
    if (this.office.company && this.office.company.id)
      this.office.companyId = this.office.company.id;
  }

  private findAddress() {
    if (this.cep.value.length === 8) {
      this.officeService
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

    this.office.address = newAddress;
  }
}
