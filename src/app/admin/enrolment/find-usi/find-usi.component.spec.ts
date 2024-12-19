import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindUsiComponent } from './find-usi.component';

describe('FindUsiComponent', () => {
  let component: FindUsiComponent;
  let fixture: ComponentFixture<FindUsiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindUsiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindUsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
