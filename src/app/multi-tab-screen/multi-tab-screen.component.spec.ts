import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTabScreenComponent } from './multi-tab-screen.component';

describe('MultiTabScreenComponent', () => {
  let component: MultiTabScreenComponent;
  let fixture: ComponentFixture<MultiTabScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiTabScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiTabScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
