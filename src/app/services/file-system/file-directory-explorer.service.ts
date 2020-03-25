import { Injectable } from '@angular/core';
import { TorrentDataStoreService } from '../torrent-management/torrent-data-store.service';
import { FileSystemService } from './file-system.service';

@Injectable({
  providedIn: 'root'
})
export class FileDirectoryExplorerService {

  private directories: string[];

  constructor(private data_store: TorrentDataStoreService, private fs: FileSystemService) {
    
  }


  /**Callback for when data in data_store is updated */
  private async updateDirectories(): Promise<void> {

  }
}
