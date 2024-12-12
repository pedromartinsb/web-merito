import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subscription } from 'rxjs';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { Company } from 'src/app/models/company';
import { Office } from 'src/app/models/office';
import {
  Address,
  AddressSearch,
  Contact,
  Person,
  Roles,
  User,
} from 'src/app/models/person';
import { Responsibility } from 'src/app/models/responsibility';
import { Routine } from 'src/app/models/routine';
import { OfficeService } from 'src/app/services/office.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { RoutineService } from 'src/app/services/routine.service';

import { PersonService } from '../../../services/person.service';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css'],
})
export class PersonFormComponent implements OnInit, AfterViewInit, OnDestroy {
  _companies: Company[] = [];
  officies: Office[] = [];
  responsibilities: Responsibility[] = [];
  user: User = {
    username: '',
    email: '',
    roles: null,
    password: '',
  };
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
  person: Person = {
    name: '',
    cpfCnpj: '',
    personType: 'Colaborador',
    gender: 'Masculino',
    contractType: 'Clt',
    birthdate: '',
    picture: '',
    office: null,
    officeId: '',
    officeFantasyName: '',
    responsibility: null,
    responsibilityId: '',
    user: this.user,
    supervisor: null,
    supervisorId: '',
    address: this.address,
    contact: this.contact,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };
  roleLabels = [
    { label: 'Admin Grupo', value: { name: Roles.ROLE_ADMIN_GERAL } },
    { label: 'Admin Empresa', value: { name: Roles.ROLE_ADMIN_COMPANY } },
    { label: 'Admin Unidade', value: { name: Roles.ROLE_ADMIN_OFFICE } },
    { label: 'Supervisor', value: { name: Roles.ROLE_SUPERVISOR } },
    {
      label: 'Colaborador ou Profissional',
      value: { name: Roles.ROLE_USER_OFFICE },
    },
  ];
  personId: string;
  isSaving: boolean = false;
  isCpf: boolean = true;
  contractType: string = '';
  cepValueChangesSubscription: Subscription;
  radioContractTypeOptions: string = 'Clt';
  radioGenderOptions: string = 'Masculino';
  hide: boolean = true;
  // Routines
  ELEMENT_DATA: Routine[] = [];
  FILTERED_DATA: Routine[] = [];
  displayedColumns: string[] = ['name', 'responsibility'];
  dataSource = new MatTableDataSource<Routine>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  isLoading: boolean = false;
  isAdmin: boolean = false;
  documents: NgxFileDropEntry[] = [];

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
  phoneFormControl: FormControl = new FormControl();
  cellphoneFormControl: FormControl = new FormControl();
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
  roleFormControl: FormControl = new FormControl(null, Validators.minLength(1));

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  _roles: Roles[] = [];
  get roles(): Roles[] {
    return this._roles;
  }
  set roles(value: Roles[]) {
    this._roles = value;
  }

  constructor(
    private personService: PersonService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private officeService: OfficeService,
    private responsibilityService: ResponsibilityService,
    private routineService: RoutineService,
    private _location: Location,
    private authGuard: AuthGuard,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.personId = this.route.snapshot.params['id'];
    this._getContractType('Clt');
    if (this.personId) {
      this._getPersonById(this.personId);
    } else {
      this._getOfficesAndResponsibilitiesAndRoles();
    }
    this.cepValueChangesSubscription =
      this.cepFormControl.valueChanges.subscribe((newCep: string) => {
        if (newCep && newCep.length === 8) {
          this._getAddress();
        }
      });
    this.isAdmin = this.authGuard.checkIsAdmin();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.cepValueChangesSubscription) {
      this.cepValueChangesSubscription.unsubscribe();
    }
  }

  backClicked() {
    this._location.back();
  }

  private _getOfficesAndResponsibilitiesAndRoles() {
    this._getOfficies();
    this._getResponsibilities();
    this._getRoles();
  }

  private _getRoutinesByResponsibilityId(id: string): void {
    this.routineService.findAllByResponsibility(id).subscribe((response) => {
      if (response) {
        this.ELEMENT_DATA = response;
        this.dataSource = new MatTableDataSource<Routine>(response);
        this.dataSource.paginator = this.paginator;
      }
      this.isLoading = false;
    });
  }

  private _getOfficies(): void {
    this.officeService.findAll().subscribe((response: Office[]) => {
      this.officies = response;
      if (this.personId) {
        this.officeFormControl.setValue(
          response.find((p) => p.id === this.person.office.id)
        );
        this.person.officeId = this.person.office.id;
      }
    });
  }

  private _getResponsibilities(): void {
    this.responsibilityService
      .findAll()
      .subscribe((response: Responsibility[]) => {
        this.responsibilities = response;
        if (this.personId) {
          this.responsibilityFormControl.setValue(
            response.find((p) => p.id === this.person.responsibility.id)
          );
          this.person.responsibilityId = this.person.responsibility.id;
        }
      });
  }

  private _getPersonById(id: string): void {
    this.personService
      .findById(id)
      .pipe(
        finalize(() => {
          this._getOfficesAndResponsibilitiesAndRoles();
          this._getRoutinesByResponsibilityId(this.person.responsibility.id);
        })
      )
      .subscribe((response) => {
        if (response['contractType'] === 'Autônomo') {
          response['contractType'] = 'Autônomo';
          this.radioContractTypeOptions = 'Autônomo';
          this.isCpf = false;
        }
        if (response['gender'] === 'Feminino') {
          response['gender'] = 'Feminino';
          this.radioGenderOptions = 'Feminino';
        }
        this.person = response;
      });
  }

  public save(): void {
    this.isSaving = true;
    if (this.documents[0] == undefined) {
      this.toast.error('É obrigatório cadastrar uma imagem.');
      this.isSaving = false;
    } else {
      const fileEntry = this.documents[0].fileEntry as FileSystemFileEntry;
      fileEntry.file((document: File) => {
        this.personService.create(this.person, document).subscribe({
          next: () => {
            this.toast.success(
              'Colaborador cadastrado com sucesso',
              'Cadastro'
            );
            this.router.navigate(['person']);
            this.isSaving = false;
          },
          error: (ex) => {
            this._handleErrors(ex);
            this.isSaving = false;
          },
        });
      });
    }
  }

  public update(): void {
    this.isSaving = true;
    console.log(this.person.picture);

    if (this.documents[0] == undefined && this.person.picture == null) {
      this.toast.error('É obrigatório cadastrar uma imagem.');
      this.isSaving = false;
    } else if (this.documents[0] == undefined && this.person.picture) {
      this.personService
        .updateWithoutFile(this.person.id, this.person)
        .subscribe({
          next: () => {
            this.toast.success(
              'Colaborador atualizado com sucesso',
              'Atualização'
            );
            this.router.navigate(['person']);
            this.isSaving = false;
          },
          error: (ex) => {
            this._handleErrors(ex);
            this.isSaving = false;
          },
        });
    } else {
      const fileEntry = this.documents[0].fileEntry as FileSystemFileEntry;
      fileEntry.file((document: File) => {
        this.personService
          .update(this.person.id, this.person, document)
          .subscribe({
            next: () => {
              this.toast.success(
                'Colaborador atualizado com sucesso',
                'Atualização'
              );
              this.router.navigate(['person']);
              this.isSaving = false;
            },
            error: (ex) => {
              this._handleErrors(ex);
              this.isSaving = false;
            },
          });
      });
    }
  }

  public addPersonType(personTypeRequest: any): void {
    this.person.personType = personTypeRequest;
  }

  public validateFields(): boolean {
    return (
      this.nameFormControl.valid &&
      this.cpfFormControl.valid &&
      this.emailFormControl.valid &&
      this.responsibilityFormControl.valid
    );
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  // ver sobre remover
  public addRole(role: any): void {
    if (this.person.user.roles.includes(role)) {
      this.person.user.roles.splice(this.person.user.roles.indexOf(role), 1);
    } else {
      this.person.user.roles.push(role);
    }
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

  public compareRoles(role1: any, role2: any): boolean {
    return role1.name === role2.name;
  }

  private _getAddress() {
    if (this.cepFormControl.value.length === 8) {
      this.personService
        .findAddress(this.cepFormControl.value)
        .subscribe((response: AddressSearch) => {
          if (response.cep && response.cep.length > 0) {
            this._setAddress(response);
            this.toast.success(
              'Endereço preenchido com Sucesso',
              'Atualização'
            );
          } else {
            this.toast.error('CEP não encontrado.');
          }
        });
    }
  }

  private _setAddress(addressSearch: AddressSearch) {
    const currentCep = this.cepFormControl.value;

    let newAddress: Address = {
      cep: currentCep,
      city: addressSearch.localidade,
      complement: addressSearch.complemento,
      neighborhood: addressSearch.bairro,
      streetName: addressSearch.logradouro,
      uf: addressSearch.uf,
    };

    this.cityFormControl.patchValue(addressSearch.localidade);
    this.complementFormControl.patchValue(addressSearch.complemento);
    this.neighborhoodFormControl.patchValue(addressSearch.bairro);
    this.streetNameFormControl.patchValue(addressSearch.logradouro);
    this.ufFormControl.patchValue(addressSearch.uf);

    this.person.address = newAddress;
  }

  private _getContractType(contractType: string): void {
    this.person.contractType = contractType;
    if (contractType === 'Clt') {
      this.isCpf = true;
      this.person.contractType = 'Clt';
    } else if (contractType === 'Autônomo') {
      this.isCpf = false;
      this.person.contractType = 'Autônomo';
    }
  }

  public getGender(gender: string): void {
    this.person.gender = gender;
  }

  public droppedDocument(documents: NgxFileDropEntry[]) {
    this.documents = documents;
  }
}
