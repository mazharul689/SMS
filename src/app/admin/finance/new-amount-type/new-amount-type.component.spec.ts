import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAmountTypeComponent } from './new-amount-type.component';

describe('NewAmountTypeComponent', () => {
  let component: NewAmountTypeComponent;
  let fixture: ComponentFixture<NewAmountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAmountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAmountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
