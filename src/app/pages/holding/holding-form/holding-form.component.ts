import { HoldingService } from '../../../services/holding.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  Address,
  AddressSearch,
  Contact,
  Holding,
} from 'src/app/models/holding';
import { SegmentService } from 'src/app/services/segment.service';
import { Segment } from 'src/app/models/segment';
import { PersonService } from 'src/app/services/person.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-holding-form',
  templateUrl: './holding-form.component.html',
  styleUrls: ['./holding-form.component.css'],
})
export class HoldingFormComponent implements OnInit {
  segments: Segment[] = [];

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

  holding: Holding = {
    fantasyName: '',
    corporateReason: '',
    cnpj: '',
    identifier: '',
    email: '',
    website: '',
    contact: this.contact,
    address: this.address,
    segment: null,
    segmentId: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  holdingId: string;

  fantasyName: FormControl = new FormControl(null, Validators.minLength(3));
  corporateReason: FormControl = new FormControl(null, Validators.minLength(3));
  cnpj: FormControl = new FormControl(null, [
    Validators.maxLength(14),
    Validators.required,
  ]);
  identifier: FormControl = new FormControl(null, Validators.minLength(3));
  email: FormControl = new FormControl();
  website: FormControl = new FormControl();
  segment: FormControl = new FormControl(null, [Validators.required]);

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
    private personService: PersonService,
    private holdingService: HoldingService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private segmentService: SegmentService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.holdingId = this.route.snapshot.params['id'];
    if (this.holdingId) {
      this.loadHolding();
    }
    this.findAllSegments();
    this.cep.valueChanges.subscribe((newCep: string) => {
      if (newCep && newCep.length === 8) {
        this.findAddress();
      }
    });
  }

  backClicked() {
    this._location.back();
  }

  findAllSegments(): void {
    this.segmentService.findAll().subscribe((response) => {
      this.segments = response;
      if (this.holdingId) {
        this.segment.setValue(
          response.find((s) => s.id === this.holding.segment.id)
        );
        this.holding.segmentId = this.holding.segment.id;
      }
    });
  }

  loadHolding(): void {
    this.holdingService.findById(this.holdingId).subscribe((response) => {
      this.holding = response;
    });
  }

  openHoldingForm(): void {
    if (this.holdingId) {
      this.updateHolding();
    } else {
      this.createHolding();
    }
  }

  private createHolding(): void {
    this.isSaving = true;
    this.holdingService.create(this.holding).subscribe({
      next: () => {
        this.toast.success(
          'Rede de Empresa cadastrada com sucesso',
          'Cadastro'
        );
        this.router.navigate(['holding']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private updateHolding(): void {
    this.isSaving = true;
    this.holdingService.update(this.holdingId, this.holding).subscribe({
      next: () => {
        this.toast.success(
          'Rede de Empresa atualizada com sucesso',
          'Atualização'
        );
        this.router.navigate(['holding']);
        this.isSaving = false;
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
    return this.fantasyName.valid;
  }

  private findAddress() {
    if (this.cep.value.length === 8) {
      this.personService
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

    this.holding.address = newAddress;
  }
}
