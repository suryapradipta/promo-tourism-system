import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantAnalyticsComponent } from './merchant-analytics.component';

describe('MerchantAnalyticsComponent', () => {
  let component: MerchantAnalyticsComponent;
  let fixture: ComponentFixture<MerchantAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MerchantAnalyticsComponent]
    });
    fixture = TestBed.createComponent(MerchantAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
