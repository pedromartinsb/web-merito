import { Injectable } from "@angular/core";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Config } from "src/app/config/api.config";

@Injectable({
  providedIn: "root",
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe(
      "pk_test_51Pa5whFWq9758l3JjrbcO3JeiRmBzr0dgPQNaWdSmXp2GtqOskC5PvF7mNvdVGHvMcqfma4aKkzuOp9RLLA8vQqR00GE82MsK8"
    );
  }

  async getStripe() {
    return await this.stripePromise;
  }

  createCustomer(email: string, name: string, paymentMethodId: string): Observable<any> {
    return this.http.post(`${Config.webApiUrl}/v1/stripe/create-customer`, { email, name, paymentMethodId });
  }

  createSubscription(customerId: string, priceId: string): Observable<any> {
    return this.http.post(`${Config.webApiUrl}/v1/stripe/create-subscription`, { customerId, priceId });
  }
}
