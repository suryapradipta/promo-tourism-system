import { TestBed } from '@angular/core/testing';

import { GenerateReceiptService } from './generate-receipt.service';

describe('GenerateReceiptService', () => {
  let service: GenerateReceiptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateReceiptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
