import { GoalService } from '../../../services/goal.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PersonService } from 'src/app/services/person.service';
import { Person } from 'src/app/models/person';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';
import { Goal } from 'src/app/features/employees/components/employee-appointment/employee-appointment.component';

@Component({
  selector: 'app-goal-form',
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.css'],
})
export class GoalFormComponent implements OnInit {
  persons: Array<Person>;
  goal: Goal = {
    title: '',
    description: '',
    personId: '',
    startDate: '',
    endDate: '',
  };
  goalId: string;
  selectedPerson: any = [];
  selectedPersonId: Array<string> = [];

  nameFormControl: FormControl = new FormControl(null, Validators.minLength(3));
  personsFormControl: FormControl = new FormControl([1]);

  isSaving: boolean = false;

  constructor(
    private goalService: GoalService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private personService: PersonService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.goalId = this.route.snapshot.params['id'];
    if (this.goalId) {
      this._getGoalById(this.goalId);
    } else {
      this._getAllPersons();
    }
  }

  public backClicked() {
    this._location.back();
  }

  private _getAllPersons(): void {
    this.personService.findAll().subscribe({
      next: (response: Array<Person>) => (this.persons = response),
      error: (ex) => this._handleErrors(ex),
    });
  }

  private _getGoalById(id: string): void {
    this.goalService
      .findById(id)
      .pipe(
        finalize(() => {
          this._getAllPersons();
          this.selectedPerson.map((item: string) => {
            this.selectedPersonId.push(item);
          });
        })
      )
      .subscribe({
        next: (response: Goal) => {
          this.goal = response;
        },
        error: (ex) => this._handleErrors(ex),
      });
  }

  public save(): void {
    this.isSaving = true;
    this.goalService.create(this.goal).subscribe({
      next: () => {
        this.toast.success('Meta cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['goal']);
        this.isSaving = false;
      },
      error: (ex) => {
        this._handleErrors(ex);
      },
    });
  }

  public update(): void {
    this.isSaving = true;
    this.goalService.updateByName(this.goalId, this.goal).subscribe({
      next: () => {
        this.toast.success('Meta atualizada com sucesso', 'Atualização');
        this.router.navigate(['goal']);
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
