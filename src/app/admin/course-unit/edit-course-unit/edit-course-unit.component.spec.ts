import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCourseUnitComponent } from './edit-course-unit.component';

describe('EditCourseUnitComponent', () => {
  let component: EditCourseUnitComponent;
  let fixture: ComponentFixture<EditCourseUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCourseUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCourseUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
