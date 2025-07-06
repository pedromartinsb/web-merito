import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { Roles } from "./models/person";
import { FirstAccessComponent } from "./pages/first-access/first-access.component";
import { SigninComponent } from "./pages/sign-in/sign-in.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { SelectCompanyComponent } from "./pages/select-company/select-company.component";
import { PageNotFoundComponent } from "./pages/page-not-found/page-not-found.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { LandingPageComponent } from "./pages/landing-page/landing-page.component";

const routes: Routes = [
  { path: "login", component: SigninComponent },
  { path: "landing-page", component: LandingPageComponent },
  { path: "", component: SigninComponent },
  { path: "sign-in", component: SigninComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent },

  {
    path: "select-company",
    component: SelectCompanyComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Roles.ROLE_ADMIN, Roles.ROLE_SUPERVISOR, Roles.ROLE_MANAGER, Roles.ROLE_USER],
    },
  },

  {
    path: "first-access",
    component: FirstAccessComponent,
    canActivate: [AuthGuard],
    data: {
      role: [Roles.ROLE_ADMIN, Roles.ROLE_SUPERVISOR, Roles.ROLE_MANAGER, Roles.ROLE_USER],
    },
  },

  // Rota curinga: qualquer caminho não definido redireciona para a página de erro
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
