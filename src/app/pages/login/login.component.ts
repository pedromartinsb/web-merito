import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/models/login';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PersonService } from 'src/app/services/person.service';
import { Urls } from 'src/app/config/urls.config';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

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

  isXSmallScreenSize: boolean = false;
  isSmallScreenSize: boolean = false;
  isMediumScreenSize: boolean = false;
  isLargeScreenSize: boolean = false;
  isXLargeScreenSize: boolean = false;

  destroyed = new Subject<void>();
  currentScreenSize: string;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

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
  password: FormControl = new FormControl(null, [Validators.required, Validators.min(3)]);

  public isLoggin: boolean = false;
  public hide: boolean = true;
  isPasswordVisible = false;
  get passwordInput() {
    return this.password;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService,
    private personService: PersonService,
    breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            // if (
            //   this.displayNameMap.get(query) === 'Small' ||
            //   this.displayNameMap.get(query) === 'XSmall'
            // ) {
            //   this.currentScreenSize = this.displayNameMap.get(query);
            //   console.log(this.currentScreenSize)
            // }

            this.isXSmallScreenSize = false;
            this.isSmallScreenSize = false;
            this.isMediumScreenSize = false;
            this.isLargeScreenSize = false;
            this.isXLargeScreenSize = false;
            switch (this.displayNameMap.get(query)) {
              case 'XSmall':
                this.isXSmallScreenSize = true;
                break;
              case 'Small':
                this.isSmallScreenSize = true;
                break;
              case 'Medium':
                this.isMediumScreenSize = true;
                break;
              case 'Large':
                this.isLargeScreenSize = true;
                break;
              case 'XLarge':
                this.isXLargeScreenSize = true;
                break;
            }
          }
        }
      });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  public validateFields(): boolean {
    return this.password.valid && this.username.valid;
  }

  private cleanFields(): void {
    this.username.reset();
    this.password.reset();
  }

  onSubmit(): void {
    this.isLoggin = true;

    if (this.credentials.get('username').value == null ||
        this.credentials.get('password').value == null ||
        this.credentials.get('username').value == '' ||
        this.credentials.get('password').value == '') {
      this.isLoggin = false;
      this.toast.error("Usuário e Senha precisam estar preenchidos.");
      return;
    }

    this.authService.authenticate(this.credentials.get('username').value, this.credentials.get('password').value)
        .subscribe({
          next: (data) => {
            this.cleanFields();
            this.login = data.body;
            this.authService.successfulLogin(
              this.login.token,
              this.login.roles,
              this.login.officeResponses
            );
            this.personService.findByRequest().subscribe({
              next: (person) => {
                localStorage.setItem('personName', person.name);
                person.picture != null
                  ? localStorage.setItem('personPicture', person.picture)
                  : localStorage.setItem('personPicture', Urls.getDefaultPictureS3());
                this.isLoggin = false;
                this.router.navigate(['home']);
                this.toast.success('Login realizado com sucesso', 'Login');
              },
              error: (err: HttpErrorResponse) => {
                this.isLoggin = false;
                this._handleErrors(err);
              }
            });
          },
          error: (err: HttpErrorResponse) => {
            this.isLoggin = false;
            this._handleErrors(err);
          }
        });
  }

  _handleErrors(ex): void {
    if (ex.status == 0 && ex.statusText == 'Unknown Error') {
      this.toast.warning('Estamos passando por instabilidades no servidor. Por favor, testar novamente mais tarde!')
    } else {
      if (ex.error.errors) {
        ex.error.errors.forEach((element) => {
          this.toast.error(element.message);
        });
      } else {
        this.toast.error(ex.error.message);
      }
    }
  }
}
