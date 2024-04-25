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
  routine: Routine = {
    name: '',
    responsibilityId: '',
    responsibility: null,
    appointment: null,
    startedAt: '',
    finishedAt: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  responsibilities: Responsibility[] = [];

  routineId: string;
  responsibilityId: string;

  name: FormControl = new FormControl(null, Validators.minLength(3));
  responsibility: FormControl = new FormControl(null, []);

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
    this.routineId = this.route.snapshot.params['id'];
    this.responsibilityId = this.route.snapshot.params['responsibilityId'];
    if (this.routineId) {
      this.loadRoutine();
    } else {
      this.findAllResponsibilities();
    }
  }

  backClicked() {
    this._location.back();
  }

  findAllResponsibilities(): void {
    this.responsibilityService.findAll().subscribe((response) => {
      this.responsibilities = response;
      if (this.routineId) {
        this.responsibility.setValue(
          response.find((p) => p.id === this.routine.responsibility.id)
        );
        this.routine.responsibilityId = this.routine.responsibility.id;
      }
    });
  }

  loadRoutine(): void {
    this.routineService
      .findById(this.routineId)
      .subscribe((response: Routine) => {
        this.routine = response;
        this.findAllResponsibilities();
      });
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
