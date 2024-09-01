import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCourseIntakeDateComponent } from './edit-course-intake-date.component';

describe('EditCourseIntakeDateComponent', () => {
  let component: EditCourseIntakeDateComponent;
  let fixture: ComponentFixture<EditCourseIntakeDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCourseIntakeDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCourseIntakeDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
