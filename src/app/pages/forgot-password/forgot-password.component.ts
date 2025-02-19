import { Component } from "@angular/core";
import { Router } from "@angular/router";

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

  constructor(private router: Router) {}

  resetPassword(): void {
    if (!this.email) {
      this.message = "";
      this.errorMessage = "Por favor, informe seu e-mail.";
      setTimeout(() => {
        this.errorMessage = "";
      }, 2000);
      return;
    }
    this.isLoading = true;
    // Simulação do envio de instruções para redefinir a senha
    setTimeout(() => {
      this.isLoading = false;
      this.errorMessage = "";
      this.message =
        "Instruções para redefinir sua senha foram enviadas para seu e-mail. Você será redirecionado para tela de Login...";
      setTimeout(() => {
        this.router.navigate(["/sign-in"]);
      }, 2000);
    }, 2000);
  }
}
