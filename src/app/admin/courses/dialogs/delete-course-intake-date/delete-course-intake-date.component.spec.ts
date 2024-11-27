import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCourseIntakeDateComponent } from './delete-course-intake-date.component';

describe('DeleteCourseIntakeDateComponent', () => {
  let component: DeleteCourseIntakeDateComponent;
  let fixture: ComponentFixture<DeleteCourseIntakeDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCourseIntakeDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCourseIntakeDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
