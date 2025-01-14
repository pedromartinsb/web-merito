import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Roles, UserResponse } from 'src/app/models/person';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.css'],
})
export class PermissionFormComponent implements OnInit {
  private isSaving: boolean = false;

  roles: Roles[] = [];
  users: UserResponse[] = [];

  userResponse: UserResponse = {
    id: '',
    username: '',
    roles: null,
  };

  roleLabels = [
    { label: 'Usuário', value: { name: 'ROLE_USER' } },
    { label: 'Admin', value: { name: 'ROLE_ADMIN' } },
    { label: 'Moderador', value: { name: 'ROLE_MODERATOR' } },
  ];

  user: FormControl = new FormControl(null, [Validators.required]);
  role: FormControl = new FormControl(null, Validators.minLength(1));

  constructor(
    private userService: UserService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findAllUsers();
  }

  routeToHome(): void {
    this.router.navigate(['home']);
  }

  validateFields(): boolean {
    return this.user.valid && this.role.valid;
  }

  get saving(): boolean {
    return this.isSaving;
  }

  savePermitions() {
    this.isSaving = true;
    this.userService
      .addPermissions(this.userResponse.id, this.userResponse)
      .subscribe({
        next: () => {
          this.toast.success('Permissões alteradas com sucesso', 'Alteração');
          this.router.navigate(['home']);
          this.isSaving = false;
        },
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
  }

  compareRoles(role1: any, role2: any): boolean {
    return role1.name === role2.name;
  }

  findAllUsers(): void {
    this.isSaving = true;
    this.userService.findAll().subscribe((response: UserResponse[]) => {
      this.users = response;
      this.isSaving = false;
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
}
