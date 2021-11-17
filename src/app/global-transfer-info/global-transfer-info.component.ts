import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TorrentDataStoreService } from 'src/app/services/torrent-management/torrent-data-store.service';
import { GlobalTransferInfo, MainData } from 'src/utils/Interfaces';
import { UnitsHelperService } from 'src/app/services/units-helper.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';
import { NetworkConnectionInformationService } from 'src/app/services/network/network-connection-information.service';
import { RateLimitsDialogComponent } from '../modals/rate-limits-dialog/rate-limits-dialog.component';
import { IsMobileUser } from 'src/utils/Helpers';
import { TorrentFilterService } from '../services/torrent-filter-service.service';

@Component({
  selector: 'app-global-transfer-info',
  templateUrl: './global-transfer-info.component.html',
  styleUrls: ['./global-transfer-info.component.scss']
})
export class GlobalTransferInfoComponent implements OnInit {

  public data: GlobalTransferInfo = null;

  public isAltSpeedEnabled: boolean;
  public refreshInterval = -1;

  public filteringBy = 'all';

  public isDarkTheme: Observable<boolean>;
  public isMobileUser = IsMobileUser();

  constructor(private data_store: TorrentDataStoreService, private networkInfo: NetworkConnectionInformationService, private units_helper:
              UnitsHelperService, private rateLimitDialog: MatDialog, private filterService: TorrentFilterService, private theme: ThemeService) { }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
    // Subscribe to any changes with data store
    this.data_store.GetTorrentDataSubscription().subscribe((res: MainData) => {
      if(res) {
        this.handleDataChange(res.server_state);
      }
    });

    // Store refresh interval & subscribe to any changes
    this.refreshInterval = this.networkInfo.getRefreshInterval();
    this.networkInfo.get_network_change_subscription()
    .subscribe(newInterval => {
      this.refreshInterval = this.networkInfo.getRefreshInterval();
    })
  }

  handleDataChange(newData: GlobalTransferInfo): void {
    this.data = newData;
    this.isAltSpeedEnabled = this.data.use_alt_speed_limits;
  }

  handleDownloadLimitSelect() {
    this.rateLimitDialog.open(RateLimitsDialogComponent, {
      autoFocus: false,
      data: {
        for: 'Download',
        currentLimit: this.data.dl_rate_limit
      },
      panelClass: "generic-dialog"
    });
  }

  handleUploadLimitSelect() {
    this.rateLimitDialog.open(RateLimitsDialogComponent, {
      autoFocus: false,
      data: {
        for: 'Upload',
        currentLimit: this.data.dl_rate_limit
      },
      panelClass: "generic-dialog"
    });
  }

  handleFilterStatusSelect(filterChosen: any) {
    this.filteringBy = filterChosen;
    console.log('filtering by', filterChosen);
    this.filterService.updateFilter(filterChosen);
  }

  isSelected(chip: string) { return this.filteringBy === chip }

  async toggleAltSpeedLimits() {
    console.log('toggled alt limits')
    this.isAltSpeedEnabled = !this.isAltSpeedEnabled
    await this.data_store.ToggleAltSpeedLimits();
  }

  getDownloadSpeedString() {
    return `${this.units_helper.GetFileSizeString(this.data.dl_info_speed)}/s`;
  }

  getDownloadedString() {
    return `${this.units_helper.GetFileSizeString(this.data.dl_info_data)}`;
  }

  getUploadSpeedString() {
    return `${this.units_helper.GetFileSizeString(this.data.up_info_speed)}/s`;
  }

  getUploadedString() {
    return `${this.units_helper.GetFileSizeString(this.data.up_info_data)}`;
  }

  getDownLimitString() {
    return (this.isAltSpeedEnabled || this.data.dl_rate_limit > 0) ? `[${this.units_helper.GetFileSizeString(this.data.dl_rate_limit)}/s]` : '';
  }

  getUpLimitString() {
    return (this.isAltSpeedEnabled || this.data.up_rate_limit > 0) ? `[${this.units_helper.GetFileSizeString(this.data.up_rate_limit)}/s]` : '';
  }

  getFreeSpaceOnDisk() {
    return `${this.units_helper.GetFileSizeString(this.data.free_space_on_disk)}`;
  }

  isLoading(): boolean {
    return !this.data;
  }

}
