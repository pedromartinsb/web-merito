import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-payment-success",
  templateUrl: "./payment-success.component.html",
  styleUrls: ["./payment-success.component.scss"],
})
export class PaymentSuccessComponent implements OnInit {
  paymentId: string | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state && navigation.extras.state.paymentId) {
      this.paymentId = navigation.extras.state.paymentId;
    }
  }

  ngOnInit(): void {}
}
