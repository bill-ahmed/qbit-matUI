import { TestBed } from '@angular/core/testing';

import { NetworkConnectionInformationService } from './network-connection-information.service';

describe('NetworkConnectionInformationService', () => {
  let service: NetworkConnectionInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkConnectionInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
