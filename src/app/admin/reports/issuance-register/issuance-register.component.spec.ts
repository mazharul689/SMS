import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuanceRegisterComponent } from './issuance-register.component';

describe('IssuanceRegisterComponent', () => {
  let component: IssuanceRegisterComponent;
  let fixture: ComponentFixture<IssuanceRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuanceRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuanceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
