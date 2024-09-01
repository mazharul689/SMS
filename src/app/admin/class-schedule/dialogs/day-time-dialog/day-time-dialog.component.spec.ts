import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTimeDialogComponent } from './day-time-dialog.component';

describe('DayTimeDialogComponent', () => {
  let component: DayTimeDialogComponent;
  let fixture: ComponentFixture<DayTimeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayTimeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
