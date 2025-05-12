import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreUnitsComponent } from './add-more-units.component';

describe('AddMoreUnitsComponent', () => {
  let component: AddMoreUnitsComponent;
  let fixture: ComponentFixture<AddMoreUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMoreUnitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
