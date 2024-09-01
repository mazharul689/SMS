import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseIntakeDialogComponent } from './course-intake-dialog.component';

describe('CourseIntakeDialogComponent', () => {
  let component: CourseIntakeDialogComponent;
  let fixture: ComponentFixture<CourseIntakeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseIntakeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseIntakeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
