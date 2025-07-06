import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AuthRequestInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (token) {
      const cloneReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloneReq);
    }

    return next.handle(request);
  }
}

export const AuthInterceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: AuthRequestInterceptor, multi: true }];
