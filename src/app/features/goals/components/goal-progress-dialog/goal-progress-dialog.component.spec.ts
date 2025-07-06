import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalProgressDialogComponent } from './goal-progress-dialog.component';

describe('GoalProgressDialogComponent', () => {
  let component: GoalProgressDialogComponent;
  let fixture: ComponentFixture<GoalProgressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalProgressDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
