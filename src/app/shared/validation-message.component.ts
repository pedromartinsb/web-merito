import { Component, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-validation-message",
  template: `
    <div *ngIf="control?.invalid && (control?.touched || control?.dirty)" class="invalid-feedback">
      <ng-container *ngIf="control?.errors?.['required']">Campo obrigatório.</ng-container>
      <ng-container *ngIf="control?.errors?.['minlength']"
        >Tamanho mínimo: {{ control.errors.minlength.requiredLength }}</ng-container
      >
      <div *ngIf="control?.errors?.['maxlength']">
        Máximo de {{ control.errors.maxlength.requiredLength }} caracteres.
      </div>
      <div *ngIf="control?.errors?.['email']">E-mail inválido.</div>
      <!-- Outros erros genéricos -->
    </div>
  `,
})
export class ValidationMessageComponent {
  @Input() control: AbstractControl | null = null;
}
