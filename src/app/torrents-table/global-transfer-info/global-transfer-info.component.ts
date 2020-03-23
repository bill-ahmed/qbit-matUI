import { Component, OnInit } from '@angular/core';
import { TorrentDataStoreService } from 'src/app/services/torrent-management/torrent-data-store.service';
import { GlobalTransferInfo, MainData } from 'src/utils/Interfaces';

@Component({
  selector: 'app-global-transfer-info',
  templateUrl: './global-transfer-info.component.html',
  styleUrls: ['./global-transfer-info.component.css']
})
export class GlobalTransferInfoComponent implements OnInit {

  public data: GlobalTransferInfo = null;

  constructor(private data_store: TorrentDataStoreService) { }

  ngOnInit(): void {
    
    // Subscribe to any changes with data store
    this.data_store.GetTorrentDataSubscription().subscribe((res: MainData) => {
      if(res) {
        this.handleDataChange(res.server_state);
      }
    })
  }

  handleDataChange(newData: GlobalTransferInfo): void {
    console.log(newData);
    this.data = newData;
  }

  isLoading(): boolean {
    return !this.data;
  }

}
