import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAmountTypeComponent } from './all-amount-type.component';

describe('AllAmountTypeComponent', () => {
  let component: AllAmountTypeComponent;
  let fixture: ComponentFixture<AllAmountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllAmountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAmountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
