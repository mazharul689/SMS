import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllVenueComponent } from './all-venue.component';

describe('AllVenueComponent', () => {
  let component: AllVenueComponent;
  let fixture: ComponentFixture<AllVenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllVenueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
