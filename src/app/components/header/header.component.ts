import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { OfficeResponse } from "src/app/models/office";
import { AuthService } from "src/app/services/auth.service";
import { StorageService } from "src/app/services/storage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  selectedCompany: OfficeResponse;
  officeResponses: OfficeResponse[] = [];

  @Output() sidenav: EventEmitter<any> = new EventEmitter();
  @Output() inputLogout: EventEmitter<any> = new EventEmitter();

  constructor(
    public router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.officeResponses = JSON.parse(localStorage.getItem("officeResponses"));
    const officeId = localStorage.getItem("officeId");
    this.selectedCompany = this.officeResponses.filter((o) => o.id === officeId)[0];
  }

  toggle() {
    this.sidenav.emit();
  }

  // logout() {
  //   this.inputLogout.emit();
  // }

  logout() {
    this.authService.logout();
    this.storageService.clean();
    this.toast.info("Logout realizado com sucesso", "Logout");
    this.router.navigate(["login"]);
  }

  editCompany(event: any) {
    this.selectedCompany = event.value;
  }

  changeCurrentOffice(element: OfficeResponse) {
    this.selectedCompany = element;
    localStorage.setItem("officeId", element.id);
    window.location.reload();
  }
}
