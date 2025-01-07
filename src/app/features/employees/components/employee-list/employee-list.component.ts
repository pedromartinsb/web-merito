import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from "../../services/employee.service";
import {ToastrService} from "ngx-toastr";
import { Urls } from 'src/app/config/urls.config';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employeeHeaders = [
    'Id',
    'Foto',
    'Nome',
    'Cargo',
    'Permissão'
  ];
  employeeData = [];

  userForm: FormGroup;
  loading: boolean = true; // Estado de carregamento
  deleting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    public router: Router,
    private toast: ToastrService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.employeeService.findAllEmployees()
      .subscribe({
        next: (employees) => {
          if (employees != null) {
            employees.forEach((response) => {
              response.picture = response.picture == null ? Urls.getDefaultPictureS3() : response.picture;
              let accessType = (response.accessType == "Manager") ? ("Gerente") : ((response.accessType == "User") ? ("Usuário") : ("Supervisor"));
              const employee = [
                response.id,
                response.picture,
                response.name,
                response.responsibilityName,
                accessType
              ];
              this.employeeData.push(employee);
            });
          }
          this.loading = false;
        },
        error: (ex) => {
          this._handleErrors(ex);
          this.loading = false;
        },
      });
  }

  onEdit(employee: any) {
    const id = employee[0];
    this.router.navigate(['/employees/edit/', id]);
  }

  onDelete(row: any) {
    this.deleting = true;
    this.employeeService.delete(row[0])
    .subscribe({
      next: () => {
        this.toast.success('Funcionário desativado com sucesso!');
        this.loading = false;
        window.location.reload();
        this.deleting = false;
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.deleting = false;
      },
    });
  }

  onView(row: any) {
    console.log(row);
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
}
