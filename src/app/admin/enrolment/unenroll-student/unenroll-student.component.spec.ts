import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnenrollStudentComponent } from './unenroll-student.component';

describe('UnenrollStudentComponent', () => {
  let component: UnenrollStudentComponent;
  let fixture: ComponentFixture<UnenrollStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnenrollStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnenrollStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
