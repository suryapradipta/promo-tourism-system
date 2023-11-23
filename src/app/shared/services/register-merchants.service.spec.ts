import { TestBed } from '@angular/core/testing';

import { RegisterMerchantsService } from './register-merchants.service';

describe('RegisterMerchantsService', () => {
  let service: RegisterMerchantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterMerchantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
