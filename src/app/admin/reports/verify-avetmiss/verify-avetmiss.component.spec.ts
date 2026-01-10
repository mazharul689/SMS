import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAvetmissComponent } from './verify-avetmiss.component';

describe('VerifyAvetmissComponent', () => {
  let component: VerifyAvetmissComponent;
  let fixture: ComponentFixture<VerifyAvetmissComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyAvetmissComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyAvetmissComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
