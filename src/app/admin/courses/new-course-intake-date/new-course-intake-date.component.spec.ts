import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCourseIntakeDateComponent } from './new-course-intake-date.component';

describe('NewCourseIntakeDateComponent', () => {
  let component: NewCourseIntakeDateComponent;
  let fixture: ComponentFixture<NewCourseIntakeDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCourseIntakeDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCourseIntakeDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
