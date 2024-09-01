import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCourseUnitsComponent } from './edit-course-units.component';

describe('EditCourseUnitsComponent', () => {
  let component: EditCourseUnitsComponent;
  let fixture: ComponentFixture<EditCourseUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCourseUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCourseUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
