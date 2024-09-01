import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCertificateComponent } from './delete-certificate.component';

describe('DeleteCertificateComponent', () => {
  let component: DeleteCertificateComponent;
  let fixture: ComponentFixture<DeleteCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
