import { TestBed } from '@angular/core/testing';

import { LeftNavService } from './left-nav.service';

describe('LeftNavService', () => {
  let service: LeftNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeftNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
