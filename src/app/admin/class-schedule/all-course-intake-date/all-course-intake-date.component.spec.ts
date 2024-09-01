import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCourseIntakeDateComponent } from './all-course-intake-date.component';

describe('AllCourseIntakeDateComponent', () => {
  let component: AllCourseIntakeDateComponent;
  let fixture: ComponentFixture<AllCourseIntakeDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCourseIntakeDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCourseIntakeDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
