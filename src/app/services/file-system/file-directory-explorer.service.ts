import { Injectable } from '@angular/core';
import { TorrentDataStoreService } from '../torrent-management/torrent-data-store.service';
import { FileSystemService } from './file-system.service';
import TreeNode from './TreeNode';
import { MainData, Torrent } from 'src/utils/Interfaces';
import DirectoryNode from './FileSystemNodes/DirectoryNode';

@Injectable({
  providedIn: 'root'
})
export class FileDirectoryExplorerService {

  public isFileSystemLoaded = false;

  constructor(private data_store: TorrentDataStoreService, private fs: FileSystemService) {
    this.getData();
  }

  private async getData(): Promise<void> {
    let data = await this.data_store.GetTorrentData();   // Need all torrents, so we use RID=0
    this.updateDirectories(data.torrents);
  }

  public getFileSystem(): DirectoryNode {
    return this.fs.getFileSystem();
  }


  /**Callback for when data in data_store is updated */
  private async updateDirectories(torrents: Torrent[]): Promise<void> {

    // Need to extract all unique save paths from list of torrents
    let set_of_dir = new Set<string>();

    torrents.forEach((elem: Torrent) => {
      set_of_dir.add(elem.save_path);
    });

    this.fs.populateFileSystem([...set_of_dir]);
    this.isFileSystemLoaded = true;
  }
}
