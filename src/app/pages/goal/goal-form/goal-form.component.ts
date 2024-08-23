import { GoalService } from '../../../services/goal.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Goal } from 'src/app/models/goal';
import { PersonService } from 'src/app/services/person.service';
import { Person } from 'src/app/models/person';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-goal-form',
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.css'],
})
export class GoalFormComponent implements OnInit {
  persons: Person[] = [];

  goal: Goal = {
    name: '',
    persons: [],
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  goalId: string;

  name: FormControl = new FormControl(null, Validators.minLength(3));
  person: FormControl = new FormControl(null, [Validators.required]);

  public isSaving: boolean = false;

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
      this.loadGoal();
    } else {
      this.findAllPersons();
    }
  }

  backClicked() {
    this._location.back();
  }

  findAllPersons(): void {
    // this.personService.findAll().subscribe((response: Person[]) => {
    //   this.persons = response;
    //   if (this.goalId) {
    //     this.person.setValue(
    //       response.find((p) => p.id === this.goal.person.id)
    //     );
    //     this.goal.personId = this.goal.person.id;
    //   }
    // });
  }

  loadGoal(): void {
    this.goalService
      .findById(this.goalId)
      .pipe(
        finalize(() => {
          this.findAllPersons();
        })
      )
      .subscribe((response: Goal) => {
        this.goal = response;
      });
  }

  openGoalForm(): void {
    if (this.goalId) {
      this.updateGoal();
    } else {
      this.createGoal();
    }
  }

  private createGoal(): void {
    this.isSaving = true;
    this.goalService.create(this.goal).subscribe({
      next: () => {
        this.toast.success('Meta cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['goal']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private updateGoal(): void {
    this.isSaving = true;
    this.goalService.update(this.goalId, this.goal).subscribe({
      next: () => {
        this.toast.success('Meta atualizada com sucesso', 'Atualização');
        this.router.navigate(['goal']);
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
}
