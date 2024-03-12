import { SegmentService } from '../../../services/segment.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Segment } from 'src/app/models/segment';

@Component({
  selector: 'app-segment-form',
  templateUrl: './segment-form.component.html',
  styleUrls: ['./segment-form.component.css']
})
export class SegmentFormComponent implements OnInit {

  segment: Segment = {
    name: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  segmentId: string;

  name: FormControl = new FormControl(null, Validators.minLength(3));

  isSaving: boolean = false;

  constructor(
    private segmentService: SegmentService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.segmentId = this.route.snapshot.params['id'];
    if (this.segmentId) {
      this.loadSegment();
    }
  }

  loadSegment(): void {
    this.segmentService.findById(this.segmentId).subscribe(response => {
      this.segment = response;
    });
  }

  openSegmentForm(): void {
    if (this.segmentId) {
      this.updateSegment();
    } else {
      this.createSegment();
    }
  }

  private createSegment(): void {
    this.isSaving = true;
    this.segmentService.create(this.segment).subscribe({
      next: () => {
        this.toast.success('Segmento cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['segment']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private updateSegment(): void {
    this.isSaving = true;
    this.segmentService.update(this.segmentId, this.segment).subscribe({
      next: () => {
        this.toast.success('Segmento atualizado com sucesso', 'Atualização');
        this.router.navigate(['segment']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach(element => {
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
