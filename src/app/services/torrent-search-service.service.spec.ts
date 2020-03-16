import { TestBed } from '@angular/core/testing';

import { TorrentSearchServiceService } from './torrent-search-service.service';

describe('TorrentSearchServiceService', () => {
  let service: TorrentSearchServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TorrentSearchServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
