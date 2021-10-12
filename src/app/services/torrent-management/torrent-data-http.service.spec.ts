import { HttpClientModule } from "@angular/common/http";
import { inject, TestBed, waitForAsync } from "@angular/core/testing";
import axios from 'axios';
import { log } from "spec/helpers";
import { TorrentDataHTTPService } from "./torrent-data-http.service";

describe('TorrentDataHTTPService', () => {
  let service: TorrentDataHTTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TorrentDataHTTPService], imports: [HttpClientModule] });
    service = TestBed.inject(TorrentDataHTTPService);
  });

  it('should have the correct root endpoint', () => {
    expect(service.http_endpoints.root).toEqual('/api/v2');
  });

  it('should get correct build information', async (done: DoneFn) => {
    let {appVersion, apiVersion} = await service.GetApplicationBuildInfo();
    expect(appVersion).toEqual('v4.3.5');
    expect(apiVersion).toEqual('2.0');

    done();
  });

  it('should get correct main data', async (done: DoneFn) => {
    let mainData = await service.GetAllTorrentData(0, {}).toPromise();
    const { rid, full_update, torrents } = mainData;

    expect(rid).toBeGreaterThanOrEqual(0);
    expect(full_update).toBeTrue();
    expect(torrents).toBeTruthy();

    done();
  });
});
