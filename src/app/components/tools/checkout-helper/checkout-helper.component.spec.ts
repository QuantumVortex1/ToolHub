import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutHelperComponent } from './checkout-helper.component';

describe('CheckoutHelperComponent', () => {
  let component: CheckoutHelperComponent;
  let fixture: ComponentFixture<CheckoutHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutHelperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
