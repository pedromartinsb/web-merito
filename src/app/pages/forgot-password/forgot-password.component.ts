import { ForgotPasswordService } from "./../../services/forgot-password.service";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

export interface ForgotPassword {
  email: string;
}

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent {
  email: string = "";
  isLoading: boolean = false;
  message: string = "";
  errorMessage: string = "";

  constructor(
    private router: Router,
    private forgotPasswordService: ForgotPasswordService,
    private toast: ToastrService
  ) {}

  forgotPassword(): void {
    if (!this.email) {
      this.message = "";
      this.errorMessage = "Por favor, informe seu e-mail.";
      setTimeout(() => {
        this.errorMessage = "";
      }, 2000);
      return;
    }
    this.isLoading = true;

    const forgotPassword: ForgotPassword = { email: this.email };
    this.forgotPasswordService.forgotPassword(forgotPassword).subscribe({
      next: () => {
        this.toast.success("Instruções para redefinir sua senha foram enviadas para seu e-mail.");
        this.router.navigate(["/sign-in"]);
      },
      error: (err) => this.toast.error("Ocorreu um erro para enviar e-mail."),
    });
  }
}
