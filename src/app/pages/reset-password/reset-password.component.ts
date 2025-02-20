import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ResetPasswordService } from "src/app/services/reset-password.service";
import { ToastrService } from "ngx-toastr";

export interface ResetPassword {
  token: string;
  newPassword: string;
}

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Captura o token enviado como parâmetro na URL
    this.route.queryParams.subscribe((params) => {
      this.token = params["token"];
    });

    // Inicializa o formulário com os campos de nova senha e confirmação
    this.resetForm = this.fb.group(
      {
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Validador para garantir que as senhas coincidem
  passwordMatchValidator(form: FormGroup) {
    return form.get("newPassword").value === form.get("confirmPassword").value ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }

    const resetPassword: ResetPassword = {
      token: this.token,
      newPassword: this.resetForm.get("newPassword").value,
    };
    this.resetPasswordService.resetPassword(resetPassword).subscribe({
      next: () => {
        this.toast.success("Senha alterada com sucesso!");
        this.router.navigate(["/sign-in"]);
      },
      error: (err) => {
        console.log(err);
        this.toast.error("Erro ao redefinir a senha. Token inválido ou expirado.");
      },
    });
  }
}
