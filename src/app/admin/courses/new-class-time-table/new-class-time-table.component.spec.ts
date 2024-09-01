import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClassTimeTableComponent } from './new-class-time-table.component';

describe('NewClassTimeTableComponent', () => {
  let component: NewClassTimeTableComponent;
  let fixture: ComponentFixture<NewClassTimeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewClassTimeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClassTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
