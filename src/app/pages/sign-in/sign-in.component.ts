import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Urls } from "src/app/config/urls.config";
import { Login } from "src/app/models/login";
import { AuthService } from "src/app/services/auth.service";
import { PersonService } from "src/app/services/person.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SigninComponent {
  username: string = "";
  password: string = "";
  isLoading: boolean = false;
  hidePassword: boolean = true;
  login: Login = {
    username: "",
    companyId: "",
    companyNames: [],
    token: "",
    roles: [],
    firstAccess: false,
    officeResponses: [],
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private personService: PersonService,
    private toast: ToastrService
  ) {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  private cleanFields(): void {
    this.username = "";
    this.password = "";
  }

  onSubmit(): void {
    this.isLoading = true;

    if (!this.username || !this.password) {
      this.isLoading = false;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Usuário e Senha precisam estar preenchidos!",
      });
      return;
    }

    this.authService.authenticate(this.username, this.password).subscribe({
      next: (data) => {
        this.cleanFields();
        this.login = data.body;
        this.authService.successfulLogin(this.login.token, this.login.roles, this.login.officeResponses);
        this.personService.findByRequest().subscribe({
          next: (person) => {
            if (person.name !== null) {
              localStorage.setItem("personName", person.name);
            }

            person.picture != null
              ? localStorage.setItem("personPicture", person.picture)
              : localStorage.setItem("personPicture", Urls.getDefaultPictureS3());
            this.isLoading = false;
            this.router.navigate(["select-company"]);
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            this._handleErrors(err);
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this._handleErrors(err);
      },
    });
  }

  private _handleErrors(ex): void {
    if (ex.status == 0 && ex.statusText == "Unknown Error") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Estamos passando por instabilidades no servidor. Por favor, testar novamente mais tarde!",
        footer: '<a href="#">Por que esse erro acontece?</a>',
      });
      return;
    }

    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: element.message,
        });
        this.toast.error(element.message);
      });
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ex.error.message,
    });
  }
}
