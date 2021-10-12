import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { log } from "spec/helpers";
import { TorrentDataStoreService } from "./torrent-data-store.service";

describe('TorrentDataHTTPService', () => {
  let service: TorrentDataStoreService;

  // beforeEach(() => {
  //   TestBed.configureTestingModule({ providers: [TorrentDataStoreService], imports: [HttpClientModule] });
  //   service = TestBed.inject(TorrentDataStoreService);
  // });

  // afterAll(() => {
  //   service.StopRefreshingData();
  // });

  // it('should give formatted main data', (done: DoneFn) => {


  //   done();
  // });

  // it('should 1', async (done: DoneFn) => {


  //   done();
  // });

  // it('should 2', async (done: DoneFn) => {


  //   done();
  // });
});
