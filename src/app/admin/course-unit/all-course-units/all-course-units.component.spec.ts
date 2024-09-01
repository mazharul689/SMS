import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCourseUnitsComponent } from './all-course-units.component';

describe('AllCourseUnitsComponent', () => {
  let component: AllCourseUnitsComponent;
  let fixture: ComponentFixture<AllCourseUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCourseUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCourseUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
