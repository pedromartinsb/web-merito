import { Component, OnInit } from "@angular/core";
import { Stripe, StripeCardElement, loadStripe } from "@stripe/stripe-js";
import { StripeService } from "../../services/stripe.service";
import { Router } from "@angular/router";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: "app-subscription",
  templateUrl: "./stripe-payment.component.html",
  styleUrls: ["./stripe-payment.component.scss"],
})
export class StripePaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  cardElement: StripeCardElement | any;
  email = "";
  name = "";
  selectedPlanId = "";
  isLoading = false; // Indicador de loading para bloquear a UI
  plans: Plan[] = [
    {
      id: "price_1QtXSEFWq9758l3JnqPOPebd",
      name: "Plano Básico",
      description: "Acesso limitado ao conteúdo",
      price: 1000,
    },
    { id: "price_premium", name: "Plano Premium", description: "Acesso completo e exclusivo", price: 2000 },
  ];

  constructor(private stripeService: StripeService, private router: Router) {}

  async ngOnInit() {
    this.stripe = await loadStripe(
      "pk_test_51Pa5whFWq9758l3JjrbcO3JeiRmBzr0dgPQNaWdSmXp2GtqOskC5PvF7mNvdVGHvMcqfma4aKkzuOp9RLLA8vQqR00GE82MsK8"
    );
    const elements = this.stripe!.elements();
    this.cardElement = elements.create("card", { hidePostalCode: true });
    this.cardElement.mount("#card-element");
  }

  selectPlan(planId: string) {
    // Permite a seleção apenas se não estiver carregando
    if (!this.isLoading) {
      this.selectedPlanId = planId;
    }
  }

  async handleSubscribe() {
    if (!this.selectedPlanId) {
      alert("Selecione um plano!");
      return;
    }
    if (!this.email || !this.name) {
      alert("Preencha seu nome e e-mail!");
      return;
    }
    this.isLoading = true; // Bloqueia a UI

    // Cria o método de pagamento com o cardElement
    const { paymentMethod, error } = await this.stripe!.createPaymentMethod({
      type: "card",
      card: this.cardElement,
      billing_details: { email: this.email, name: this.name },
    });

    if (error) {
      console.error(error);
      this.isLoading = false;
      return;
    }

    // Cria o cliente no backend
    this.stripeService.createCustomer(this.email, this.name, paymentMethod.id).subscribe((response) => {
      const customerId = response.customerId;

      // Cria a assinatura e obtém o clientSecret do Payment Intent
      this.stripeService.createSubscription(customerId, this.selectedPlanId).subscribe(
        (subResponse) => {
          const clientSecret = subResponse.clientSecret;
          console.log("Client Secret:", clientSecret);
          if (!clientSecret) {
            console.error("Client secret not returned from backend.");
            this.isLoading = false;
            return;
          }

          // Confirma o pagamento no frontend
          this.stripe!.confirmCardPayment(clientSecret, {
            payment_method: paymentMethod.id,
          }).then(
            (result) => {
              if (result.error) {
                console.error("Erro ao confirmar o pagamento:", result.error.message);
                alert("Erro ao confirmar o pagamento: " + result.error.message);
              } else {
                console.log("Pagamento confirmado e assinatura ativa!", result.paymentIntent);
                // Aqui você pode atualizar a interface ou notificar o usuário
                this.router.navigate(["/subscription/success"], { state: { paymentId: result.paymentIntent.id } });
              }
              this.isLoading = false;
            },
            (err) => {
              console.error(err);
              this.isLoading = false;
            }
          );
        },
        (err) => {
          console.error(err);
          this.isLoading = false;
        }
      );
    });
  }
}
