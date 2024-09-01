import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPaymentPlanComponent } from './all-payment-plan.component';

describe('AllPaymentPlanComponent', () => {
  let component: AllPaymentPlanComponent;
  let fixture: ComponentFixture<AllPaymentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPaymentPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPaymentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
