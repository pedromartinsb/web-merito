import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Goal } from 'src/app/features/employees/components/employee-appointment/employee-appointment.component';
import { GoalService } from 'src/app/services/goal.service';

@Component({
  selector: 'app-goals-form',
  templateUrl: './goals-form.component.html',
  styleUrls: ['./goals-form.component.css']
})
export class GoalsFormComponent implements OnInit {

  isSaving: boolean = false;

  formGroup: FormGroup;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private goalService: GoalService,
    private toast: ToastrService,
    private router: Router,
  ) {
    this.formGroup = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      personId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    if (id) {
      this.goalService.findById(id).subscribe({
        next: (response) => {
          this.formGroup.get('id').patchValue(id);
          this.formGroup.get('title').patchValue(response.title);
          this.formGroup.get('description').patchValue(response.description);
          this.formGroup.get('personId').patchValue(response.personId);
          this.formGroup.get('startDate').patchValue(response.startDate);
          this.formGroup.get('endDate').patchValue(response.endDate);
        },
        error: (error: Error) => {
          this._handleErrors(error);
        },
      });
    }
  }

  onSubmit() {
    this.isSaving = true;

    if (this.formGroup.valid) {
      const goal: Goal = {
        id: this.formGroup.get('id')?.value,
        personId: this.formGroup.get('personId')?.value,
        title: this.formGroup.get('title')?.value,
        description: this.formGroup.get('description')?.value,
        startDate: this.formGroup.get('startDate')?.value,
        endDate: this.formGroup.get('endDate')?.value
      };

      if (this.formGroup.get('id').value != '') {
        // update
        this.goalService.update(goal.id, goal).subscribe({
          next: () => {
            this.router.navigate(['goals']).then(success => {
              if (success) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            });
            this.isSaving = false;
            this.toast.success('🎉 Meta atualiza com sucesso!');
          },
          error: (error: Error) => {
            this._handleErrors(error);
          },
        });

      } else {
        // create
        this.goalService.create(goal).subscribe({
          next: () => {
            this.router.navigate(['goals']).then(success => {
              if (success) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            });
            this.isSaving = false;
            this.toast.success('🎉 Meta salva com sucesso!');
          },
          error: (error: Error) => {
            this._handleErrors(error);
          },
        });
      }

    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.toast.error('O formulário para cadastro não é válido. Alguma informação deve estar errada.')
    }
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.errorMessage = 'Erro interno: ' + element.message;
        this.successMessage = null;
        setTimeout(() => {
          this.errorMessage = null;
        }, 5000);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

}
