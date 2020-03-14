import { TestBed } from '@angular/core/testing';

import { UnitsHelperService } from './units-helper.service';

describe('UnitsHelperService', () => {
  let service: UnitsHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitsHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
