import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllClassTimeTableComponent } from './all-class-time-table.component';

describe('AllClassTimeTableComponent', () => {
  let component: AllClassTimeTableComponent;
  let fixture: ComponentFixture<AllClassTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllClassTimeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllClassTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
