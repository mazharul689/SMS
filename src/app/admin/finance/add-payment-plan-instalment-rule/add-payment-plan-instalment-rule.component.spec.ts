import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentPlanInstalmentRuleComponent } from './add-payment-plan-instalment-rule.component';

describe('AddPaymentPlanInstalmentRuleComponent', () => {
  let component: AddPaymentPlanInstalmentRuleComponent;
  let fixture: ComponentFixture<AddPaymentPlanInstalmentRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaymentPlanInstalmentRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaymentPlanInstalmentRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
