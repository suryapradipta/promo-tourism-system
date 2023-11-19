import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryAnalyticsComponent } from './ministry-analytics.component';

describe('MinistryAnalyticsComponent', () => {
  let component: MinistryAnalyticsComponent;
  let fixture: ComponentFixture<MinistryAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinistryAnalyticsComponent]
    });
    fixture = TestBed.createComponent(MinistryAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
