import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaymentPlanComponent } from './new-payment-plan.component';

describe('NewPaymentPlanComponent', () => {
  let component: NewPaymentPlanComponent;
  let fixture: ComponentFixture<NewPaymentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPaymentPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
