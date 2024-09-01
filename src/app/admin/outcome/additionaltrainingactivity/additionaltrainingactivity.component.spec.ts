import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionaltrainingactivityComponent } from './additionaltrainingactivity.component';

describe('AdditionaltrainingactivityComponent', () => {
  let component: AdditionaltrainingactivityComponent;
  let fixture: ComponentFixture<AdditionaltrainingactivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionaltrainingactivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionaltrainingactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
