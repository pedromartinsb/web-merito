import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-description-modal',
  templateUrl: './description-modal.html',
  styleUrls: ['./description-modal.css']
})
export class DescriptionModalComponent {
  @Output() descriptionSave = new EventEmitter<{ description: string; justification: string }>();
  @Output() descriptionCancel = new EventEmitter<void>();

  description: string = '';
  justification: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.description = data.description || '';
    this.justification = data.justification || '';
  }

  save(): void {
    this.descriptionSave.emit({ description: this.description, justification: this.justification });
  }

  cancel(): void {
    this.descriptionCancel.emit();
  }
}