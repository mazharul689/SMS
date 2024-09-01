import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRuleTypeComponent } from './new-rule-type.component';

describe('NewRuleTypeComponent', () => {
  let component: NewRuleTypeComponent;
  let fixture: ComponentFixture<NewRuleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRuleTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
