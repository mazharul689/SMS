import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRuleTypeComponent } from './all-rule-type.component';

describe('AllRuleTypeComponent', () => {
  let component: AllRuleTypeComponent;
  let fixture: ComponentFixture<AllRuleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllRuleTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
