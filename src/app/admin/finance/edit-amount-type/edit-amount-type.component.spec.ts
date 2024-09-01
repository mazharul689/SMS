import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAmountTypeComponent } from './edit-amount-type.component';

describe('EditAmountTypeComponent', () => {
  let component: EditAmountTypeComponent;
  let fixture: ComponentFixture<EditAmountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAmountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAmountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
