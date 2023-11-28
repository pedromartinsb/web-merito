import { Router } from '@angular/router';
import { Holding } from './../../../models/holding';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['./company-create.component.css']
})
export class CompanyCreateComponent implements OnInit {

  holding: Holding[] = [];

  constructor(
    // private holdingService: HoldingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.findAllHolding();
  }

  findAllHolding(): void {
    // this.holdingService.findAll().subscribe(response => {
    //   this.holding = response;
    // });
  }

}
