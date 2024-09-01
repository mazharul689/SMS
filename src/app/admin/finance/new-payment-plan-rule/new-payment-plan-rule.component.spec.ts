import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaymentPlanRuleComponent } from './new-payment-plan-rule.component';

describe('NewPaymentPlanRuleComponent', () => {
  let component: NewPaymentPlanRuleComponent;
  let fixture: ComponentFixture<NewPaymentPlanRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPaymentPlanRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentPlanRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
