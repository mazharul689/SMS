import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingactivityComponent } from './trainingactivity.component';

describe('TrainingactivityComponent', () => {
  let component: TrainingactivityComponent;
  let fixture: ComponentFixture<TrainingactivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingactivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
