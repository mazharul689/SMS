import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlanInstalmentsComponent } from './payment-plan-instalments.component';

describe('PaymentPlanInstalmentsComponent', () => {
  let component: PaymentPlanInstalmentsComponent;
  let fixture: ComponentFixture<PaymentPlanInstalmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentPlanInstalmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPlanInstalmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
