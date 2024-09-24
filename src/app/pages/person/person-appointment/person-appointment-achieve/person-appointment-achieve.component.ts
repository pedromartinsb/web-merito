import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AchieveService } from 'src/app/services/achieve.service';

export interface DialogData {
  personId: string;
}

export interface Achieve {
  id?: string;
  personId: string;
  description: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-person-appointment-achieve',
  templateUrl: './person-appointment-achieve.component.html',
  styleUrls: ['./person-appointment-achieve.component.css'],
})
export class PersonAppointmentAchieveComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  descriptionFormControl: FormControl = new FormControl(
    null,
    Validators.minLength(3)
  );
  achieve: Achieve = {
    id: '',
    personId: '',
    description: '',
    startDate: '',
    endDate: '',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private toast: ToastrService,
    private achieveService: AchieveService
  ) {}

  ngOnInit(): void {
    this.achieve.personId = this.data.personId;
    this._findAchieveByPersonId();
  }

  private _findAchieveByPersonId() {
    this.achieveService.findByPersonId(this.data.personId).subscribe({
      next: (response) => {
        if (response != null) {
          this.achieve = response;
        }
      },
      error: (ex) => {
        this._handleErrors(ex);
      },
    });
  }

  public save() {
    this.achieveService.create(this.achieve).subscribe({
      next: () => {
        this.toast.success('Meta cadastrada com sucesso', 'Cadastro');
      },
      error: (ex) => {
        this._handleErrors(ex);
      },
    });
  }

  public validateFields(): boolean {
    return (
      this.achieve.description.length > 0 &&
      this.achieve.startDate != '' &&
      this.achieve.endDate != ''
    );
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }
}
