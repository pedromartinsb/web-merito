import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Activity } from 'src/app/models/appointment';
import { Tag } from 'src/app/models/tag';

export interface DialogData {
  activities: Activity[];
  tags: Tag[];
}

@Component({
  selector: 'app-person-appointment-dialog',
  templateUrl: './person-appointment-dialog.component.html',
  styleUrls: ['./person-appointment-dialog.component.scss'],
})
export class PersonAppointmentDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {}
}
