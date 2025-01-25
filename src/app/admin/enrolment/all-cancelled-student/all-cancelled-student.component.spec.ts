import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCancelledStudentComponent } from './all-cancelled-student.component';

describe('AllCancelledStudentComponent', () => {
  let component: AllCancelledStudentComponent;
  let fixture: ComponentFixture<AllCancelledStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCancelledStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCancelledStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
