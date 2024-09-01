import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvetmissComponent } from './avetmiss.component';

describe('AvetmissComponent', () => {
  let component: AvetmissComponent;
  let fixture: ComponentFixture<AvetmissComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvetmissComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvetmissComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
