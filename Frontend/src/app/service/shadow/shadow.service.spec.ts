import { TestBed } from '@angular/core/testing';

import { ShadowService } from './shadow.service';

describe('ShadowService', () => {
  let service: ShadowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShadowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
