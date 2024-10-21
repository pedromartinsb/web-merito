import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZebraTableComponent } from './zebra-table.component';

describe('ZebraTableComponent', () => {
  let component: ZebraTableComponent;
  let fixture: ComponentFixture<ZebraTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZebraTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZebraTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
