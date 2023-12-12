import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceFrameComponent } from './device-frame.component';

describe('DeviceFrameComponent', () => {
  let component: DeviceFrameComponent;
  let fixture: ComponentFixture<DeviceFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
