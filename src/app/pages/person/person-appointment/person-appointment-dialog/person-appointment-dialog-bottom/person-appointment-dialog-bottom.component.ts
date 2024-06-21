import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  tagId: string;
  activityId: string;
  personId: string;
  description: string;
  justification: string;
}

@Component({
  selector: 'app-person-appointment-dialog-bottom',
  templateUrl: './person-appointment-dialog-bottom.component.html',
  styleUrls: ['./person-appointment-dialog-bottom.component.scss'],
})
export class PersonAppointmentDialogBottomComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
