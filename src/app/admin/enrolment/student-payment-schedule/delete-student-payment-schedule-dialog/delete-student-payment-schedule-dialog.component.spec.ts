import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteStudentPaymentScheduleDialogComponent } from './delete-student-payment-schedule-dialog.component';

describe('DeleteStudentPaymentScheduleDialogComponent', () => {
  let component: DeleteStudentPaymentScheduleDialogComponent;
  let fixture: ComponentFixture<DeleteStudentPaymentScheduleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteStudentPaymentScheduleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteStudentPaymentScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
