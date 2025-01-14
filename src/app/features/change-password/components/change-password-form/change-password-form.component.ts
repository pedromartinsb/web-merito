import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.css']
})
export class ChangePasswordFormComponent implements OnInit {
  isSaving: boolean = false;
  isCurrentPasswordVisible: boolean = false;
  isNewPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  passwordForm = new FormGroup({
    currentPassword: new FormControl(null),
    newPassword: new FormControl(null, Validators.minLength(3)),
    confirmPassword: new FormControl(null, Validators.minLength(3))
  });

  constructor(
    private router: Router,
    private personService: PersonService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.isSaving = true;
    if (this.passwordForm.get('newPassword').value != this.passwordForm.get('confirmPassword').value) {
      this.toast.error("As novas senhas não são iguais, por favor revise os valores informados.");
      this.isSaving = false;
    } else {
      this.personService.changePassword(this.passwordForm.get('currentPassword').value, this.passwordForm.get('newPassword').value)
        .subscribe({
          next: () => {
            this.router.navigate(['home']).then(success => {
              if (success) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            });
            this.isSaving = false;
            this.toast.success('🎉 Senha alterada com sucesso!');
          },
          error: (ex: any) => {
            this._handleErrors(ex);
            this.isSaving = false;
          },
        });
    }
  }

  toggleCurrentPasswordVisibility(): void {
    this.isCurrentPasswordVisible = !this.isCurrentPasswordVisible;
  }

  toggleNewPasswordVisibility(): void {
    this.isNewPasswordVisible = !this.isNewPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  validateFields(): boolean {
    return (
      this.passwordForm.get('currentPassword').value != null &&
      this.passwordForm.get('newPassword').value != null &&
      this.passwordForm.get('confirmPassword').value != null &&
      this.passwordForm.valid
    );
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element: any) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

}
