import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFinanceModelComponent } from './new-finance-model.component';

describe('NewFinanceModelComponent', () => {
  let component: NewFinanceModelComponent;
  let fixture: ComponentFixture<NewFinanceModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFinanceModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFinanceModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
