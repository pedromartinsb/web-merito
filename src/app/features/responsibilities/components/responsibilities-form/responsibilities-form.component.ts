import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfficeService } from 'src/app/services/office.service';
import { ResponsibilityRequest } from '../../responsibility.model';
import { ResponsibilitiesService } from '../../services/responsibilities.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-responsibilities-form',
  templateUrl: './responsibilities-form.component.html',
  styleUrls: ['./responsibilities-form.component.css']
})
export class ResponsibilitiesFormComponent implements OnInit {
  isSaving = false;
  formGroup: FormGroup;
  offices: any[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private officeService: OfficeService,
    private responsibilitiesService: ResponsibilitiesService,
    private toast: ToastrService
  ) {
    this.formGroup = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      officeId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this._offices();

    if (id) {
      this.responsibilitiesService.findById(id).subscribe({
        next: (response) => {
          this.formGroup.get('id').patchValue(id);
          this.formGroup.get('name').patchValue(response.name);
          this.formGroup.get('officeId').patchValue(response.officeId);
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
    const responsibility: ResponsibilityRequest = {
      name: this.formGroup.get('name')?.value,
      officeId: this.formGroup.get('officeId')?.value,
    }

    if (this.formGroup.get('id').value != '') {
      // update
      this.responsibilitiesService.update(this.formGroup.get('id').value, responsibility).subscribe({
        next: () => {
          this.router.navigate(['responsibilities']).then(success => {
            if (success) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
          this.isSaving = false;
          this.toast.success('🎉 Cargo salvo com sucesso!');
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
      this.responsibilitiesService.create(responsibility).subscribe({
        next: () => {
          this.router.navigate(['responsibilities']).then(success => {
            if (success) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
          this.isSaving = false;
          this.toast.success('🎉 Cargo salvo com sucesso!');
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

  onOfficeChange(event: any): void {
    this.formGroup.get('officeId').patchValue(event.target.value);
  }

  private _offices() {
    this.officeService.findAll().subscribe({
      next: (response: any[]) => {
        this.offices = response;
      },
      error: (err) => {
        console.log(err);
      }
    });
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
