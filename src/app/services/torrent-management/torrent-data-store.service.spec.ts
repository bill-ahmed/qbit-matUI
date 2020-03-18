import { TestBed } from '@angular/core/testing';

import { TorrentDataStoreService } from './torrent-data-store.service';

describe('TorrentDataStoreService', () => {
  let service: TorrentDataStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TorrentDataStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
