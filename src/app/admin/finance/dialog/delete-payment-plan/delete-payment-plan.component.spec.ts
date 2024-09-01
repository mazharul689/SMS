import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePaymentPlanComponent } from './delete-payment-plan.component';

describe('DeletePaymentPlanComponent', () => {
  let component: DeletePaymentPlanComponent;
  let fixture: ComponentFixture<DeletePaymentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePaymentPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePaymentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
