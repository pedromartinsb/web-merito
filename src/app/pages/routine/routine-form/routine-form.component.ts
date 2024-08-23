import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Routine } from 'src/app/models/routine';
import { RoutineService } from 'src/app/services/routine.service';
import { Location } from '@angular/common';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { Responsibility } from 'src/app/models/responsibility';

@Component({
  selector: 'app-routine-form',
  templateUrl: './routine-form.component.html',
  styleUrls: ['./routine-form.component.css'],
})
export class RoutineFormComponent implements OnInit {
  responsibilities: Responsibility[] = [];

  routine: Routine = {
    name: '',
    appointment: null,
    responsibility: null,
    startedAt: '',
    finishedAt: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  routineId: string;
  responsibilityId: string;
  returnedResponsibilities: Responsibility[];
  returnedResponsibilities2: Routine[];

  name: FormControl = new FormControl(null, Validators.minLength(3));
  responsibility: FormControl = new FormControl(null, Validators.minLength(1));

  public isSaving: boolean = false;

  constructor(
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private responsibilityService: ResponsibilityService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.routineService.findByName('AAAAAAAAAAAAAAAAAAAAAA').subscribe({
      next: (response) => {
        this.returnedResponsibilities2 = response;
      },
      error: (err) => {},
      complete() {},
    });

    this.returnedResponsibilities2.map((item) => console.log(item));

    this.responsibilityService.findAll().subscribe({
      next: (response) => {
        this.responsibilities = response;
      },
      complete() {},
    });

    this.routineId = this.route.snapshot.params['id'];
    if (this.routineId) {
      this.findRoutineById();
    } else {
      this.findAllResponsibilities();
    }
  }

  backClicked() {
    this._location.back();
  }

  findRoutineById(): void {
    this.routineService.findById(this.routineId).subscribe((response) => {
      this.routine = response;
    });
  }

  findAllResponsibilities(): void {
    // this.responsibilityService.findAll().subscribe((response) => {
    //   this.responsibilities = response;
    // });
  }

  loadResponsibility(): void {
    this.responsibilityService
      .findById(this.responsibilityId)
      .subscribe((response: Responsibility) => {
        this.responsibility.setValue(response);
      });
  }

  openRoutineForm(): void {
    if (this.routineId) {
      this.updateRoutine();
    } else {
      this.createRoutine();
    }
  }

  private createRoutine(): void {
    this.isSaving = true;
    this.routineService.create(this.routine).subscribe({
      next: () => {
        this.toast.success('Rotina cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['routine']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
        this.isSaving = false;
      },
    });
  }

  private updateRoutine(): void {
    this.isSaving = true;
    this.routineService.update(this.routineId, this.routine).subscribe({
      next: () => {
        this.toast.success('Rotina atualizada com sucesso', 'Atualização');
        this.router.navigate(['routine']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  validateFields(): boolean {
    return this.name.valid;
  }

  selectResponsibility() {
    if (this.responsibility.value) {
      let responsibility: Responsibility = this.responsibility.value;
      this.responsibilityId = responsibility.id;
    }
  }
}
