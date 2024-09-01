import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFinanceModelComponent } from './all-finance-model.component';

describe('AllFinanceModelComponent', () => {
  let component: AllFinanceModelComponent;
  let fixture: ComponentFixture<AllFinanceModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllFinanceModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFinanceModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
