import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPaymentScheduleComponent } from './student-payment-schedule.component';

describe('StudentPaymentScheduleComponent', () => {
  let component: StudentPaymentScheduleComponent;
  let fixture: ComponentFixture<StudentPaymentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPaymentScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPaymentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
