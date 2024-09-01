import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRuleTypeComponent } from './edit-rule-type.component';

describe('EditRuleTypeComponent', () => {
  let component: EditRuleTypeComponent;
  let fixture: ComponentFixture<EditRuleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRuleTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
