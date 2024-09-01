import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentPlanRuleComponent } from './edit-payment-plan-rule.component';

describe('EditPaymentPlanRuleComponent', () => {
  let component: EditPaymentPlanRuleComponent;
  let fixture: ComponentFixture<EditPaymentPlanRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPaymentPlanRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentPlanRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
