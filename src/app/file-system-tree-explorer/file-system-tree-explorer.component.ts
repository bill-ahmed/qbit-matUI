import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FileSystemService, SerializedNode } from '../services/file-system/file-system.service';
import { PrettyPrintTorrentDataService } from '../services/pretty-print-torrent-data.service';
import DirectoryNode from '../services/file-system/FileSystemNodes/DirectoryNode';

@Component({
  selector: 'app-file-system-tree-explorer',
  templateUrl: './file-system-tree-explorer.component.html',
  styleUrls: ['./file-system-tree-explorer.component.scss']
})
export class FileSystemTreeExplorerComponent implements OnChanges {
  @Input() directories: SerializedNode[];
  @Input() showProgress: boolean = false;

  public isLoading = true;

  /** Controls for tree components */
  public treeControl = new NestedTreeControl<SerializedNode>(node => node.children);
  public dataSource = new MatTreeNestedDataSource<SerializedNode>();

  private root: DirectoryNode;                           /** File System to keep track of the files in a torrent */
  private serialized_root: SerializedNode[] = [];
  private expanded_nodes: Set<string> = new Set<string>();

  constructor(private fs: FileSystemService, private pp: PrettyPrintTorrentDataService) { }

  ngOnInit(): void {
    this._updateData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.directories) {
      this.directories = changes.directories.currentValue;
      this._updateData();
    }

    if(changes.showProgress) {
      this.showProgress = changes.showProgress.currentValue;
    }
  }

  /** Refresh all filesystem data. This could potentially be an
   *  expensive operation.
   */
  private async _updateData(): Promise<void> {
    let delimiter = "";
    this.root = new DirectoryNode({value: ""});

    delimiter = this.directories.length === 0 ? "/" : FileSystemService.DetectFileDelimiter(this.directories[0].path);

    this.fs.populateFileSystemWithAdvancedOptions(this.directories, this.root, delimiter);
    this.fs.SerializeFileSystem(this.root).then(data => {
      this.serialized_root = data;
      this.dataSource.data = data;
    });

  }

  public hasChild(_: number, node: SerializedNode) {
    return !!node.children && node.children.length > 0
  }

  toggleNode(node: SerializedNode): void {

    if(this.isExpanded(node)) {
      this.collapseNode(node);
    } else {
      this.expandNode(node);
    }
  }

  expandNode(node: SerializedNode): void {
    this.expanded_nodes.add(node.name);
  }

  collapseNode(node: SerializedNode): void {
    this.expanded_nodes.delete(node.name);
  }

  collapseAllNodes(): void {
    this.expanded_nodes.clear();
  }

  isExpanded(node: SerializedNode): boolean {
    return this.expanded_nodes.has(node.name);
  }

  getNodeSize(node: SerializedNode): string {
    return this.pp.pretty_print_file_size(node.size);
  }

  getNodeProgress(node: SerializedNode): string {
    return (node.progress * 100).toFixed(2);
  }

}
