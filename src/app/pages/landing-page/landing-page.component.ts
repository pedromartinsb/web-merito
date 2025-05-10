import { Component } from "@angular/core";
import { Router } from "@angular/router";

interface Feature {
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  title: string;
  testimonial: string;
  image?: string;
}

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent {
  headline = "Impulsione sua Gestão de Talentos";
  subheadline = "O sistema de RH para meritocracia que transforma o reconhecimento dos colaboradores.";

  features: Feature[] = [
    {
      title: "Avaliação de Desempenho",
      description: "Acompanhe e avalie o desempenho de forma objetiva e transparente.",
    },
    { title: "Feedback Contínuo", description: "Implemente feedbacks frequentes para o desenvolvimento constante." },
    { title: "Relatórios Estratégicos", description: "Gere relatórios detalhados para embasar decisões de gestão." },
  ];

  testimonials: Testimonial[] = [
    {
      name: "João Silva",
      title: "Diretor de RH",
      testimonial: "Este sistema revolucionou nossa forma de reconhecer talentos!",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Maria Oliveira",
      title: "Gerente de Talentos",
      testimonial: "Ferramenta inovadora e fácil de usar. Incrivelmente eficaz.",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Carlos Souza",
      title: "CEO",
      testimonial: "Resultados impressionantes em poucos meses de uso.",
      image: "https://via.placeholder.com/80",
    },
  ];

  constructor(private router: Router) {}

  goToPlans(): void {
    this.router.navigate(["/subscription"]);
  }

  goToLogin(): void {
    this.router.navigate(["/sign-in"]);
  }
}
