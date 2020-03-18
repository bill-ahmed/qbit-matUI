import { TestBed } from '@angular/core/testing';

import { PrettyPrintTorrentDataService } from './pretty-print-torrent-data.service';

describe('PrettyPrintTorrentDataService', () => {
  let service: PrettyPrintTorrentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrettyPrintTorrentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
