import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneCourseIntakeDateComponent } from './clone-course-intake-date.component';

describe('CloneCourseIntakeDateComponent', () => {
  let component: CloneCourseIntakeDateComponent;
  let fixture: ComponentFixture<CloneCourseIntakeDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneCourseIntakeDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneCourseIntakeDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
