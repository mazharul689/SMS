import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCourseUnitComponent } from './new-course-unit.component';

describe('NewCourseUnitComponent', () => {
  let component: NewCourseUnitComponent;
  let fixture: ComponentFixture<NewCourseUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCourseUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCourseUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
