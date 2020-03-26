import { Injectable } from '@angular/core';
import { TorrentDataStoreService } from '../torrent-management/torrent-data-store.service';
import { FileSystemService } from './file-system.service';
import TreeNode from './TreeNode';
import { MainData, Torrent } from 'src/utils/Interfaces';

@Injectable({
  providedIn: 'root'
})
export class FileDirectoryExplorerService {

  public isFileSystemLoaded = false;
  private directories: string[] = [];
  private root: TreeNode = null;

  constructor(private data_store: TorrentDataStoreService, private fs: FileSystemService) {

    this.data_store.GetTorrentDataSubscription().subscribe((result: MainData) => {

      // Only create file system if we don't already have one!
      if(result && !this.isFileSystemLoaded) { this.updateDirectories(result.torrents); }
    });
  }

  public getFileSystem(): TreeNode {
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

    this.fs.printFileSystem();

    this.isFileSystemLoaded = true;
  }
}
