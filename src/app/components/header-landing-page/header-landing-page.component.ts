import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header-landing-page",
  templateUrl: "./header-landing-page.component.html",
  styleUrls: ["./header-landing-page.component.scss"],
})
export class HeaderLandingPageComponent {
  constructor(private router: Router) {}

  goToLandingPage(): void {
    this.router.navigate(["/"]);
  }

  goToLogin(): void {
    this.router.navigate(["/sign-in"]);
  }

  goToSignup(): void {
    this.router.navigate(["/subscription"]);
  }
}
