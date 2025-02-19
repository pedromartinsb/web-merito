import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-first-access",
  templateUrl: "./first-access.component.html",
  styleUrls: ["./first-access.component.scss"],
})
export class FirstAccessComponent {
  newPassword: string = "";
  confirmPassword: string = "";
  errorMessage: string = "";
  isLoading: boolean = false;
  hidePassword: boolean = true;
  hideNewPassword: boolean = true;

  constructor(private router: Router, private userService: UserService) {}

  savePassword(): void {
    this.errorMessage = "";

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = "Preencha os dois campos para definir sua senha.";
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "As senhas não coincidem.";
      return;
    }

    // Se tudo estiver correto, inicia o loading e simula a atualização da senha
    this.isLoading = true;
    // Suponha que updatePassword retorne um Observable ou Promise
    this.userService
      .createPassword({
        password: this.newPassword,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire("Sucesso!", "Senha cadastrada com sucesso.", "success");
          this.router.navigate(["/home"]);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = "Erro ao criar a senha. Tente novamente.";
        },
      });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleNewPasswordVisibility(): void {
    this.hideNewPassword = !this.hideNewPassword;
  }
}
