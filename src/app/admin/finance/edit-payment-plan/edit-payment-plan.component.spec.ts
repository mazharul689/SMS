import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPaymentPlanComponent } from './edit-payment-plan.component';

describe('EditPaymentPlanComponent', () => {
  let component: EditPaymentPlanComponent;
  let fixture: ComponentFixture<EditPaymentPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPaymentPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPaymentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
