import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTimeDialog1Component } from './day-time-dialog1.component';

describe('DayTimeDialog1Component', () => {
  let component: DayTimeDialog1Component;
  let fixture: ComponentFixture<DayTimeDialog1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayTimeDialog1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTimeDialog1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
