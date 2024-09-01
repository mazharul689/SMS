import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCommunicationComponent } from './all-communication.component';

describe('AllCommunicationComponent', () => {
  let component: AllCommunicationComponent;
  let fixture: ComponentFixture<AllCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCommunicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
