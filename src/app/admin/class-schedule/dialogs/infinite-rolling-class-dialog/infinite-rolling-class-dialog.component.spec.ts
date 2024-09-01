import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteRollingClassDialogComponent } from './infinite-rolling-class-dialog.component';

describe('InfiniteRollingClassDialogComponent', () => {
  let component: InfiniteRollingClassDialogComponent;
  let fixture: ComponentFixture<InfiniteRollingClassDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfiniteRollingClassDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfiniteRollingClassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
