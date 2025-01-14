import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Routine } from 'src/app/models/routine';
import { RoutineService } from 'src/app/services/routine.service';
import { Location } from '@angular/common';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { Responsibility } from 'src/app/models/responsibility';
import { finalize } from 'rxjs';

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
    responsibilities: [],
    startedAt: '',
    finishedAt: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };
  routineId: string;
  selectedResponsibility: any = [];
  selectedResponsibilityId: Array<string> = [];

  nameFormControl: FormControl = new FormControl(null, Validators.minLength(3));
  responsibilityFormControl: FormControl = new FormControl([1]);

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
    if (this.routineId) {
      this._getRoutineById(this.routineId);
    } else {
      this._getResponsibilities();
    }
  }

  public backClicked() {
    this._location.back();
  }

  private _getRoutineById(id: string): void {
    this.routineService.findById(id).subscribe((response) => {
      this.routine = response;
    });

    this.routineService
      .findById(id)
      .pipe(
        finalize(() => {
          this._getResponsibilities();
          this.selectedResponsibility.map((item: string) => {
            this.selectedResponsibilityId.push(item);
          });
        })
      )
      .subscribe({
        next: (response: Routine) => {
          this.selectedResponsibility = response.responsibilities;
          this.routine = response;
        },
        error: (ex) => this._handleErrors(ex),
      });
  }

  private _getResponsibilities(): void {
    this.responsibilityService.findAll().subscribe((response) => {
      this.responsibilities = response;
    });
  }

  public save(): void {
    this.routine.responsibilities = this.selectedResponsibilityId;
    this.isSaving = true;
    this.routineService.create(this.routine).subscribe({
      next: () => {
        this.toast.success('Rotina cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['routine']);
        this.isSaving = false;
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.isSaving = false;
      },
    });
  }

  public update(): void {
    this.routine.responsibilities = this.selectedResponsibilityId;
    this.isSaving = true;
    this.routineService.updateByName(this.routineId, this.routine).subscribe({
      next: () => {
        this.toast.success('Rotina atualizada com sucesso', 'Atualização');
        this.router.navigate(['routine']);
        this.isSaving = false;
      },
      error: (ex) => {
        this._handleErrors(ex);
      },
    });
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

  public validateFields(): boolean {
    return this.nameFormControl.valid;
  }
}
