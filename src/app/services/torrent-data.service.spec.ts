import { TestBed } from '@angular/core/testing';

import { TorrentDataService } from './torrent-data.service';

describe('TorrentDataService', () => {
  let service: TorrentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TorrentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
