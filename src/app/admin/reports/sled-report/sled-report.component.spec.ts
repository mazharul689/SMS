import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SledReportComponent } from './sled-report.component';

describe('SledReportComponent', () => {
  let component: SledReportComponent;
  let fixture: ComponentFixture<SledReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SledReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SledReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
