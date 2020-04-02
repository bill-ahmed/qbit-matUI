import { Component, OnInit } from '@angular/core';
import { TorrentDataStoreService } from 'src/app/services/torrent-management/torrent-data-store.service';
import { GlobalTransferInfo, MainData } from 'src/utils/Interfaces';
import { UnitsHelperService } from 'src/app/services/units-helper.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-global-transfer-info',
  templateUrl: './global-transfer-info.component.html',
  styleUrls: ['./global-transfer-info.component.css']
})
export class GlobalTransferInfoComponent implements OnInit {

  public data: GlobalTransferInfo = null;
  public isDarkTheme: Observable<boolean>;

  constructor(private data_store: TorrentDataStoreService, private units_helper: UnitsHelperService, private theme: ThemeService) { }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
    // Subscribe to any changes with data store
    this.data_store.GetTorrentDataSubscription().subscribe((res: MainData) => {
      if(res) {
        this.handleDataChange(res.server_state);
      }
    })
  }

  handleDataChange(newData: GlobalTransferInfo): void {
    this.data = newData;
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

  getFreeSpaceOnDisk() {
    return `${this.units_helper.GetFileSizeString(this.data.free_space_on_disk)}`;
  }

  isLoading(): boolean {
    return !this.data;
  }

}
