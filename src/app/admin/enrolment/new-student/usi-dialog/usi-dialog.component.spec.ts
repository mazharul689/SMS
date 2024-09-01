import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsiDialogComponent } from './usi-dialog.component';

describe('UnitsDialogComponent', () => {
  let component: UsiDialogComponent;
  let fixture: ComponentFixture<UsiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsiDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
