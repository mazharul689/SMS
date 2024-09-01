import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFinanceModelComponent } from './edit-finance-model.component';

describe('EditFinanceModelComponent', () => {
  let component: EditFinanceModelComponent;
  let fixture: ComponentFixture<EditFinanceModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFinanceModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFinanceModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
