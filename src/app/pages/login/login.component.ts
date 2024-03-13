import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/models/login';
import { FormControl, Validators } from '@angular/forms';

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
  errorMessage = '';

  login: Login = {
    username: '',
    token: '',
    roles: [],
  };

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
    const { username, password } = this.form;

    this.authService.authenticate(username, password).subscribe({
      next: (data) => {
        this.isLoggin = false;
        this.cleanFields();
        this.login = data.body;
        this.authService.successfulLogin(this.login.token, this.login.roles);
        this.router.navigate(['']);
        this.toast.success('Login realizado com sucesso', 'Login');
      },
      error: (err) => {
        this.isLoggin = false;
        this.toast.error('Usuário e/ou senha inválidos');
        this.errorMessage = err.error.message;
      },
    });
  }
}
