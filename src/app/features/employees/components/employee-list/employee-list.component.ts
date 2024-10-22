import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from "../../services/employee.service";
import {ToastrService} from "ngx-toastr";

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
  ];
  employeeData = [];

  userForm: FormGroup;
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';
  loading: boolean = true; // Estado de carregamento

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
              if (response.picture != null) {
                response.picture = this.s3Url + response.picture;
              } else {
                response.picture = "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png";
              }
              const employee = [
                response.id,
                response.picture,
                response.name,
                response.responsibility.name
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
    console.log(row);
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
