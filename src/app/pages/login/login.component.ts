import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/models/login';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;

  login: Login = {
    username: '',
    companyId: '',
    companyNames: [],
    token: '',
    roles: [],
    firstAccess: false,
    officeResponses: [],
  };

  credentials = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  identifier: FormControl = new FormControl(null, [Validators.required]);
  username: FormControl = new FormControl(null, [Validators.required]);
  password: FormControl = new FormControl(null, [Validators.required]);

  public isLoggin: boolean = false;
  public hide: boolean = true;
  get passwordInput() {
    return this.password;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {}

  public validateFields(): boolean {
    return this.password.valid && this.username.valid;
  }

  private cleanFields(): void {
    this.username.reset();
    this.password.reset();
  }

  onSubmit(): void {
    this.isLoggin = true;

    if (this.credentials.get('username').value == null || this.credentials.get('password').value == null) {
      this.toast.error("Usuário e Senha precisam estar preenchidos.")
    } else {
      this.authService.authenticate(this.credentials.get('username').value, this.credentials.get('password').value)
        .subscribe({
          next: (data) => {
            this.isLoggin = false;
            this.cleanFields();
            this.login = data.body;
            this.authService.successfulLogin(
              this.login.token,
              this.login.roles,
              this.login.companyNames,
              this.login.officeResponses
            );
            this.router.navigate(['home']);
            this.toast.success('Login realizado com sucesso', 'Login');
          },
          error: (err) => {
            this.isLoggin = false;
            this.toast.error(err);
          },
        });
    }
  }
}
