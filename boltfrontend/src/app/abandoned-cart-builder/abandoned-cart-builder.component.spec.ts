import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedCartBuilderComponent } from './abandoned-cart-builder.component';

describe('AbandonedCartBuilderComponent', () => {
  let component: AbandonedCartBuilderComponent;
  let fixture: ComponentFixture<AbandonedCartBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbandonedCartBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbandonedCartBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
