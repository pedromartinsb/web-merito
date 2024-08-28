import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Office } from 'src/app/models/office';
import { Address, AddressSearch, Person } from 'src/app/models/person';
import { Responsibility } from 'src/app/models/responsibility';
import { Roles } from 'src/app/models/role';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() title: string = '';
  @Input() isSaving: boolean;
  @Input() isCpf: boolean = true;
  @Input() isAdmin: boolean = false;
  @Input() radioContractTypeOptions: string = 'Autônomo';
  @Input() radioGenderOptions: string = 'Masculino';
  @Input() documents: NgxFileDropEntry[] = [];
  @Input() person: Person;
  @Input() roles: Roles[] = [];
  @Input() officies: Office[] = [];
  @Input() responsibilities: Responsibility[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() addressSearch: AddressSearch;
  @Input() dataSource = new MatTableDataSource();
  @Output() personEvent = new EventEmitter<Person>();
  @Output() documentsEvent = new EventEmitter<NgxFileDropEntry[]>();
  @Output() saveEvent = new EventEmitter<{ person: Person; document: any }>();
  @Output() updateEvent = new EventEmitter<{ person: Person; document: any }>();
  @Output() addressEvent = new EventEmitter<string>();
  @ViewChild(MatSort) sort: MatSort;

  roleLabels = [
    { label: 'Admin Grupo', value: { name: Roles.ROLE_ADMIN_GERAL } },
    { label: 'Admin Empresa', value: { name: Roles.ROLE_ADMIN_COMPANY } },
    { label: 'Admin Unidade', value: { name: Roles.ROLE_ADMIN_OFFICE } },
    {
      label: 'Colaborador ou Profissional',
      value: { name: Roles.ROLE_USER_OFFICE },
    },
  ];
  cepValueChangesSubscription: Subscription;
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';

  // FormControl
  nameFormControl: FormControl = new FormControl(null, Validators.minLength(3));
  cpfFormControl: FormControl = new FormControl(null, Validators.required);
  officeFormControl: FormControl = new FormControl(null, Validators.required);
  responsibilityFormControl: FormControl = new FormControl(
    null,
    Validators.required
  );
  usernameFormControl: FormControl = new FormControl(
    null,
    Validators.minLength(3)
  );
  emailFormControl: FormControl = new FormControl(null, Validators.email);
  roleFormControl: FormControl = new FormControl(null, Validators.minLength(1));
  cepFormControl: FormControl = new FormControl(null, Validators.minLength(3));
  streetNameFormControl: FormControl = new FormControl(
    null,
    Validators.minLength(3)
  );
  neighborhoodFormControl: FormControl = new FormControl(
    null,
    Validators.minLength(3)
  );
  cityFormControl: FormControl = new FormControl(null, Validators.minLength(3));
  ufFormControl: FormControl = new FormControl(null, Validators.minLength(2));
  complementFormControl: FormControl = new FormControl(
    null,
    Validators.minLength(3)
  );
  phoneFormControl: FormControl = new FormControl();
  cellphoneFormControl: FormControl = new FormControl();

  constructor(private _location: Location, private toast: ToastrService) {}

  ngOnInit(): void {
    this.cepValueChangesSubscription =
      this.cepFormControl.valueChanges.subscribe((newCep: string) => {
        if (newCep && newCep.length === 8) {
          this._getAddress();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cepFormControl.value.length === 8) {
      const currentCep = this.cepFormControl.value;
      let newAddress: Address = {
        cep: currentCep,
        city: this.addressSearch.localidade,
        complement: this.addressSearch.complemento,
        neighborhood: this.addressSearch.bairro,
        streetName: this.addressSearch.logradouro,
        uf: this.addressSearch.uf,
      };
      this.cityFormControl.patchValue(this.addressSearch.localidade);
      this.complementFormControl.patchValue(this.addressSearch.complemento);
      this.neighborhoodFormControl.patchValue(this.addressSearch.bairro);
      this.streetNameFormControl.patchValue(this.addressSearch.logradouro);
      this.ufFormControl.patchValue(this.addressSearch.uf);
      this.person.address = newAddress;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.cepFormControl.reset();
  }

  public backClicked() {
    this._location.back();
  }

  public sendObject(value: any) {
    this.personEvent.emit(value);
  }

  public getGender(gender: string): void {
    this.person.gender = gender;
  }

  public droppedDocument(documents: NgxFileDropEntry[]) {
    this.documents = documents;
  }

  public validateFields(): boolean {
    return (
      this.nameFormControl.valid &&
      this.cpfFormControl.valid &&
      this.emailFormControl.valid &&
      this.responsibilityFormControl.valid
    );
  }

  public save() {
    if (this.documents[0] == undefined) {
      this.toast.error('É obrigatório cadastrar uma imagem.');
    } else {
      this.saveEvent.emit({
        person: this.person,
        document: this.documents[0],
      });
    }
    this.isSaving = false;
  }

  public update() {
    this.updateEvent.emit({
      person: this.person,
      document: this.documents[0],
    });
  }

  public compareRoles(role1: any, role2: any): boolean {
    return role1.name === role2.name;
  }

  private _getRoles(): void {
    if (this.person.user.roles) {
      let selectedRoles: any[] = this.roleLabels.filter((roleLabel) =>
        this.person.user.roles.some(
          (userRole) => userRole.name === roleLabel.value.name
        )
      );
      this.roleFormControl.patchValue(selectedRoles);
    }
  }

  public _getAddress() {
    if (this.cepFormControl.value.length === 8) {
      this.addressEvent.emit(this.cepFormControl.value);
    }
  }
}
