import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VefiryOtpComponent } from './vefiry-otp.component';

describe('VefiryOtpComponent', () => {
  let component: VefiryOtpComponent;
  let fixture: ComponentFixture<VefiryOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VefiryOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VefiryOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
