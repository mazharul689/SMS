import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUnitsComponent } from './assign-units.component';

describe('AssignUnitsComponent', () => {
  let component: AssignUnitsComponent;
  let fixture: ComponentFixture<AssignUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
