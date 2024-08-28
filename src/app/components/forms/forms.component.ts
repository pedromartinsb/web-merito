import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { Office } from 'src/app/models/office';
import { Person } from 'src/app/models/person';
import { Responsibility } from 'src/app/models/responsibility';
import { Roles } from 'src/app/models/role';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
})
export class FormsComponent implements AfterViewInit {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() title: string = '';
  @Input() isSaving: boolean = false;
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
  @Input() dataSource = new MatTableDataSource();
  @Output() personEvent = new EventEmitter<Person>();
  @Output() documentsEvent = new EventEmitter<NgxFileDropEntry[]>();
  @Output() saveEvent = new EventEmitter<Person>();
  @Output() updateEvent = new EventEmitter<Person>();

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

  constructor(private _location: Location) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
    this.documentsEvent.emit(documents);
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
    this.saveEvent.emit(this.person);
  }

  public update() {
    this.saveEvent.emit(this.person);
  }

  public compareRoles(role1: any, role2: any): boolean {
    return role1.name === role2.name;
  }
}
