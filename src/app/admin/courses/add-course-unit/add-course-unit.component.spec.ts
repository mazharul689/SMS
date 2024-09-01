import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseUnitComponent } from './add-course-unit.component';

describe('AddCourseUnitComponent', () => {
  let component: AddCourseUnitComponent;
  let fixture: ComponentFixture<AddCourseUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCourseUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCourseUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
