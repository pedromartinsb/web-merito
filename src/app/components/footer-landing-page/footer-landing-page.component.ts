import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-footer-landing-page",
  templateUrl: "./footer-landing-page.component.html",
  styleUrls: ["./footer-landing-page.component.scss"],
})
export class FooterLandingPageComponent {
  currentYear: number = new Date().getFullYear();
}
