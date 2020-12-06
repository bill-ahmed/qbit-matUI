import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Torrent, TorrentContents } from 'src/utils/Interfaces';
import { UnitsHelperService } from '../../services/units-helper.service';
import { PrettyPrintTorrentDataService } from '../../services/pretty-print-torrent-data.service';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';
import { TorrentDataStoreService } from '../../services/torrent-management/torrent-data-store.service';
import { NetworkConnectionInformationService } from '../../services/network/network-connection-information.service';
import { FileSystemService, SerializedNode } from '../../services/file-system/file-system.service';
import DirectoryNode from 'src/app/services/file-system/FileSystemNodes/DirectoryNode';

@Component({
  selector: 'app-torrent-info-dialog',
  templateUrl: './torrent-info-dialog.component.html',
  styleUrls: ['./torrent-info-dialog.component.css']
})
export class TorrentInfoDialogComponent implements OnInit {

  public torrent: Torrent = null;
  public torrentContents: TorrentContents[] = [];
  public torrentContentsAsNodes: SerializedNode[] = [];
  public isDarkTheme: Observable<boolean>;
  public isLoading = true;

  private panelsOpen: Set<string> = new Set<string>();
  private REFRESH_INTERVAL: any;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private units_helper: UnitsHelperService,
              private pp: PrettyPrintTorrentDataService, private theme: ThemeService, private data_store: TorrentDataStoreService,
              private network_info: NetworkConnectionInformationService, private fs: FileSystemService) {
    this.torrent = data.torrent;
  }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();

    // Get data the first time immediately
    this.data_store.GetTorrentContents(this.torrent).toPromise().then(res => {this.updateTorrentContents(res)});

    /** Refresh torrent contents data on the recommended interval */
    this.REFRESH_INTERVAL = setInterval(() => {
      this.data_store.GetTorrentContents(this.torrent).subscribe(content => {
        this.updateTorrentContents(content);
      });
    },
      this.network_info.get_refresh_interval_from_network_type("medium")
    );
  }

  ngOnDestroy(): void {
    if(this.REFRESH_INTERVAL) { clearInterval(this.REFRESH_INTERVAL) }
  }

  private async updateTorrentContents(content: TorrentContents[]): Promise<void> {
    this.torrentContents = content;

    let intermediate_nodes = this.torrentContents.map(file => {
      return {
        name: "",
        path: file.name,
        parentPath: '',
        size: file.size,
        progress: file.progress,
        type: "File"
      }
    })

    // Create a file systme represented by the above nodes
    let fs_root = new DirectoryNode({ value: '', skipNameValidation: true })
    let delimiter = intermediate_nodes.length > 0 ? FileSystemService.DetectFileDelimiter(intermediate_nodes[0].path) : '/'

    await this.fs.populateFileSystemWithAdvancedOptions(intermediate_nodes as SerializedNode[], fs_root, delimiter)

    // Serialize & update
    this.torrentContentsAsNodes = await this.fs.SerializeFileSystem(fs_root);
    this.isLoading = false;
  }

  get_content_directories_as_advanced_nodes(): SerializedNode[] {
    return this.torrentContentsAsNodes;
  }

  added_on(): string {
    return this.units_helper.GetDateString(this.torrent.added_on);
  }

  completed_on(): string {
    return this.pp.pretty_print_completed_on(this.torrent.completion_on);
  }

  last_activity(): string {
    return this.pp.pretty_print_completed_on(this.torrent.last_activity)
  }

  total_size(): string {
    return this.units_helper.GetFileSizeString(this.torrent.total_size);
  }

  downloaded(): string {
    return this.units_helper.GetFileSizeString(this.torrent.downloaded);
  }

  uploaded(): string {
    return this.units_helper.GetFileSizeString(this.torrent.uploaded)
  }

  ratio(): number {
    return Math.round(((this.torrent.ratio) + Number.EPSILON) * 100) / 100;
  }

  state(): string {
    return this.pp.pretty_print_status(this.torrent.state);
  }

  openPanel(name: string): void {
    this.panelsOpen.add(name);
  }

  closePanel(name: string): void {
    this.panelsOpen.delete(name);
  }

  isPanelOpen(name: string): boolean {
    return this.panelsOpen.has(name);
  }

}
