import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUnitsBulkHourComponent } from './set-units-bulk-hour.component';

describe('SetUnitsBulkHourComponent', () => {
  let component: SetUnitsBulkHourComponent;
  let fixture: ComponentFixture<SetUnitsBulkHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetUnitsBulkHourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUnitsBulkHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
