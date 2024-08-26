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
import { NgxFileDropEntry } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { Subscription, finalize } from 'rxjs';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { Address, Contact } from 'src/app/models/holding';
import { Office } from 'src/app/models/office';
import { AddressSearch, Person, Roles, User } from 'src/app/models/person';
import { Responsibility } from 'src/app/models/responsibility';
import { Routine } from 'src/app/models/routine';
import { OfficeService } from 'src/app/services/office.service';
import { PersonService } from 'src/app/services/person.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { RoutineService } from 'src/app/services/routine.service';

@Component({
  selector: 'app-autonomous-form',
  templateUrl: './autonomous-form.component.html',
  styleUrls: ['./autonomous-form.component.css'],
})
export class AutonomousFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  roles: Roles[] = [];
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
    picture: '',
    office: null,
    officeId: '',
    responsibility: null,
    responsibilityId: '',
    user: this.user,
    address: this.address,
    contact: this.contact,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  roleLabels = [
    { label: 'Usuário', value: { name: 'ROLE_USER' } },
    { label: 'Admin', value: { name: 'ROLE_ADMIN' } },
    { label: 'Moderador', value: { name: 'ROLE_MODERATOR' } },
  ];

  personId: string;
  isAdmin: boolean = false;

  public isSaving: boolean = false;

  isCpf: boolean = true;
  contractType: string = '';

  private cepValueChangesSubscription: Subscription;

  public radioContractTypeOptions: string = 'Autônomo';
  public radioGenderOptions: string = 'Masculino';
  public hide: boolean = true;

  // Routines
  ELEMENT_DATA: Routine[] = [];
  FILTERED_DATA: Routine[] = [];
  displayedColumns: string[] = ['name', 'responsibility'];
  dataSource = new MatTableDataSource<Routine>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public isLoading: boolean = false;
  documents: NgxFileDropEntry[] = [];
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
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

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
  ) {
    this.dataSource = new MatTableDataSource<Routine>(this.ELEMENT_DATA);
  }

  ngOnInit(): void {
    this.isAdmin = this.authGuard.checkIsAdmin();
    this.personId = this.route.snapshot.params['id'];
    this._getContractType('Autônomo');
    if (this.personId) {
      this._getPersonById(this.personId);
    } else {
      this._getOfficiesAndResponsibilitiesAndRoles();
    }
    this.cepValueChangesSubscription =
      this.cepFormControl.valueChanges.subscribe((newCep: string) => {
        if (newCep && newCep.length === 8) {
          this._getAddress();
        }
      });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.cepValueChangesSubscription) {
      this.cepValueChangesSubscription.unsubscribe();
    }
  }

  public backClicked() {
    this._location.back();
  }

  private _getOfficiesAndResponsibilitiesAndRoles() {
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
          this._getOfficiesAndResponsibilitiesAndRoles();
          this._getRoutinesByResponsibilityId(this.person.responsibility.id);
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response);

          if (response['contractType'] === 'Autônomo') {
            response['contractType'] = 'Autônomo';
            this.radioContractTypeOptions = 'Autônomo';
            this.isCpf = false;
          }
          if (response['gender'] === 'Feminino') {
            response['gender'] = 'Feminino';
            this.radioGenderOptions = 'Feminino';
          }
          if (response.picture != null) {
            response.picture = this.s3Url + response.picture;
          }
          this.person = response;
        },
        error: (err) => console.log(err),
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
              'Profissional cadastrado com sucesso',
              'Cadastro'
            );
            this.router.navigate(['autonomous']);
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
    if (this.documents[0] == undefined) {
      this.toast.error('É obrigatório cadastrar uma imagem.');
      this.isSaving = false;
    } else {
      const fileEntry = this.documents[0].fileEntry as FileSystemFileEntry;
      fileEntry.file((document: File) => {
        this.personService
          .update(this.person.id, this.person, document)
          .subscribe({
            next: () => {
              this.toast.success(
                'Profissional atualizado com sucesso',
                'Atualização'
              );
              this.router.navigate(['autonomous']);
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
