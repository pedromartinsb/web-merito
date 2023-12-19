import { HoldingService } from '../../../services/holding.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Holding } from 'src/app/models/holding';
import { SegmentService } from 'src/app/services/segment.service';
import { Segment } from 'src/app/models/segment';

@Component({
  selector: 'app-holding-form',
  templateUrl: './holding-form.component.html',
  styleUrls: ['./holding-form.component.css']
})
export class HoldingFormComponent implements OnInit {

  segments: Segment[] = [];

  holding: Holding = {
    name: '',
    segmentId: '',    
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  holdingId: string;

  name:        FormControl = new FormControl(null, Validators.minLength(3));
  segment:     FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private holdingService: HoldingService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private segmentService: SegmentService
  ) { }

  ngOnInit(): void {
    this.holdingId = this.route.snapshot.params['id'];
    if (this.holdingId) {
      this.loadHolding();
    }
    this.findAllSegments();
  }

  findAllSegments(): void {
    this.segmentService.findAll().subscribe(response => {
      this.segments = response;
    });
  }

  loadHolding(): void {
    this.holdingService.findById(this.holdingId).subscribe(response => {
      this.holding = response;
    });
  }

  openHoldingForm(): void {
    if (this.holdingId) {
      this.updateHolding();
    } else {
      this.createHolding();
    }
  }
  
  private createHolding(): void {
    this.holdingService.create(this.holding).subscribe({
      next: () => {
        this.toast.success('Holding cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['holding']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateHolding(): void {
    this.holdingService.update(this.holdingId, this.holding).subscribe({
      next: () => {
        this.toast.success('Holding atualizada com sucesso', 'Atualização');
        this.router.navigate(['holding']);
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
