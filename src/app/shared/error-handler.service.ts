import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  constructor(private toast: ToastrService) {}

  handle(error: any, customMessage?: string): void {
    if (error.error?.errors?.length) {
      error.error.errors.forEach((e: any) => this.toast.error(e.message));
    } else if (error.error?.message) {
      this.toast.error(error.error.message);
    } else if (customMessage) {
      this.toast.error(customMessage);
    } else {
      this.toast.error("Ocorreu um erro inesperado.");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
