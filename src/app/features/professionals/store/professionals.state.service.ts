import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";
import { Person } from "src/app/models/person";
import { OfficeService } from "src/app/services/office.service";
import { PersonService } from "src/app/services/person.service";

@Injectable({
  providedIn: "root",
})
export class ProfessionalsStateService {
  private officesSubject = new BehaviorSubject<any[]>([]);
  offices$ = this.officesSubject.asObservable();

  private personSubject = new BehaviorSubject<Person | null>(null);
  person$ = this.personSubject.asObservable();

  private isLoadingOfficesSubject = new BehaviorSubject<boolean>(false);
  isLoadingOffices$ = this.isLoadingOfficesSubject.asObservable();

  constructor(
    private officeService: OfficeService,
    private errorHandler: ErrorHandlerService,
    private personService: PersonService
  ) {}

  loadOfficesData(): void {
    this.isLoadingOfficesSubject.next(true);
    this.officeService.findAll().subscribe({
      next: (response) => this.officesSubject.next(response),
      error: (error) => this.errorHandler.handle(error, "Erro ao carregar empresas."),
      complete: () => this.isLoadingOfficesSubject.next(false),
    });
  }

  loadPersonById(id: string): void {
    this.personService.findById(id).subscribe({
      next: (response) => {
        this.personSubject.next(response);
      },
      error: (error) => {
        console.error("Erro ao carregar o usuário", error);
      },
    });
  }
}
