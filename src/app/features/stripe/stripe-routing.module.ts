import { RouterModule, Routes } from "@angular/router";
import { NavComponent } from "../../components/nav/nav.component";
import { AuthGuard } from "../../auth/auth.guard";
import { Roles } from "../../models/person";
import { NgModule } from "@angular/core";
import { StripePaymentComponent } from "./components/stripe-payment/stripe-payment.component";
import { PaymentSuccessComponent } from "./components/payment-success/payment-success.component";

const routes: Routes = [
  {
    path: "subscription",
    children: [
      {
        path: "",
        component: StripePaymentComponent,
        data: { role: [Roles.ROLE_ADMIN, Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR, Roles.ROLE_USER] },
      },
      {
        path: "success",
        component: PaymentSuccessComponent,
        data: { role: [Roles.ROLE_ADMIN, Roles.ROLE_MANAGER, Roles.ROLE_SUPERVISOR, Roles.ROLE_USER] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripeRoutingModule {}
