import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize, switchMap } from "rxjs";
import { Login } from "src/app/models/login";
import { AuthService } from "src/app/services/auth.service";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SigninComponent implements OnInit {
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

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [{ value: "", disabled: false }, [Validators.required]],
      password: [{ value: "", disabled: false }, Validators.required],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginForm.disable();

    const { username, password, rememberMe } = this.loginForm.getRawValue();

    this.authService
      .login(username, password, rememberMe)
      .pipe(
        switchMap((token) => {
          if (rememberMe) {
            localStorage.setItem("authToken", token);
          } else {
            sessionStorage.setItem("authToken", token);
          }
          return this.authService.getCurrentUser();
        }),
        finalize(() => {
          this.isLoading = false;
          this.loginForm.enable();
        })
      )
      .subscribe({
        next: (user) => {
          this.authService.setCurrentUser(user);
          if (user.firstAccess) {
            this.router.navigate(["first-access"]);
          }
          this.router.navigate(["select-company"]);
        },
        error: (error) => {
          this.errorHandler.handle(error, "Falha ao realizar o login:");
        },
        complete: () => {
          this.authService.removePropertyFromCurrentUser("office");
        },
      });
  }
}
