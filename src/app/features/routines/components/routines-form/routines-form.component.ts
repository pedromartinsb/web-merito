import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponsibilitiesService } from 'src/app/features/responsibilities/services/responsibilities.service';
import { RoutinesService } from '../../services/routines.service';
import { RoutineRequest } from '../../routine.model';

@Component({
  selector: 'app-routines-form',
  templateUrl: './routines-form.component.html',
  styleUrls: ['./routines-form.component.css']
})
export class RoutinesFormComponent implements OnInit {
  isSaving = false;
  formGroup: FormGroup;
  responsibilities: any[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  officeId: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private routinesService: RoutinesService,
    private responsibilitiesService: ResponsibilitiesService,
    private toast: ToastrService
  ) {
    this.formGroup = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      responsibilities: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.officeId = localStorage.getItem('officeId');
    this._responsibilities();

    if (id) {
      this.routinesService.findById(id).subscribe({
        next: (response) => {
          this.formGroup.get('id').patchValue(id);
          this.formGroup.get('name').patchValue(response.name);
          this.formGroup.get('responsibilityId').patchValue(response.responsibilityId);
        },
        error: (error: Error) => {
          this.isSaving = false;
          this._handleErrors(error);
        }
      });
    }
  }

  onSubmit() {
    this.isSaving = true;
    const routine: RoutineRequest = {
      name: this.formGroup.get('name')?.value,
      responsibilities: this.formGroup.get('responsibilities')?.value,
    }

    if (this.formGroup.get('id').value != '') {
      // update
      this.routinesService.update(this.formGroup.get('id').value, routine).subscribe({
        next: () => {
          this.router.navigate(['routines']).then(success => {
            if (success) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
          this.isSaving = false;
          this.toast.success('🎉 Rotina salva com sucesso!');
        },
        error: (error: Error) => {
          this.isSaving = false;
          this._handleErrors(error);
        },
        complete: () => {
          this.formGroup.reset();
        }
      });
    } else {
      // create
      this.routinesService.create(routine).subscribe({
        next: () => {
          this.router.navigate(['routines']).then(success => {
            if (success) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
          this.isSaving = false;
          this.toast.success('🎉 Rotina salva com sucesso!');
        },
        error: (error: Error) => {
          this.isSaving = false;
          this._handleErrors(error);
        },
        complete: () => {
          this.formGroup.reset();
        }
      });
    }
  }

  onResponsibilitiesChange(event: Event): void {
    const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
    const values = Array.from(selectedOptions).map(option => option.value);
    this.formGroup.get('responsibilities')?.setValue(values);
  }

  private _responsibilities() {
    this.responsibilitiesService.findByOffice(this.officeId).subscribe({
      next: (response: any[]) => {
        this.responsibilities = response;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getSelectedResponsibilities(): string {
    const selectedIds = this.formGroup.get('responsibilities')?.value || [];
    return this.responsibilities
      .filter(responsibility => selectedIds.includes(responsibility.id))
      .map(responsibility => responsibility.name)
      .join(', ');
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
