import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.html',
})
export class DeleteConfirmationModalComponent {
  @Output() deleteConfirmed = new EventEmitter<void>();
  @Output() deleteCanceled = new EventEmitter<void>();

  message: string;

  confirmDelete(): void {
    this.deleteConfirmed.emit();
  }

  cancelDelete(): void {
    this.deleteCanceled.emit();
  }
}