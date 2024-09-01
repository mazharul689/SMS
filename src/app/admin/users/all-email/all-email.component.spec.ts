import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEmailComponent } from './all-email.component';

describe('AllEmailComponent', () => {
  let component: AllEmailComponent;
  let fixture: ComponentFixture<AllEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
