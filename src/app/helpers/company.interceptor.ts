import { Injectable } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class CompanyRequestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUserString = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");

    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);

      if (currentUser.currentCompanyId) {
        const modifiedReq = req.clone({
          headers: req.headers.set("X-Company-Id", currentUser.currentCompanyId),
        });
        return next.handle(modifiedReq);
      }
    }

    return next.handle(req);
  }
}

export const CompanyInterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: CompanyRequestInterceptor, multi: true },
];
