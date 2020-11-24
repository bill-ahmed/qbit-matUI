import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FileSystemService, SerializedNode } from '../services/file-system/file-system.service';
import { PrettyPrintTorrentDataService } from '../services/pretty-print-torrent-data.service';
import DirectoryNode from '../services/file-system/FileSystemNodes/DirectoryNode';
import { ApplicationConfigService } from '../services/app/application-config.service';

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
  private expanded_nodes: Set<string> = new Set<string>();

  /** Keep track of which branches to render, for performance reasons
   * Only the immediate children of nodes with this ID will render!
   */
  private parentsToRender: Set<string> = new Set<string>();

  constructor(private appConfig: ApplicationConfigService, private pp: PrettyPrintTorrentDataService) { }

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
    this.dataSource = new MatTreeNestedDataSource<SerializedNode>();
    this.dataSource.data = this.directories;

    this.expanded_nodes.add('');
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
    this.expanded_nodes.add(node.parentPath);

    if(node.name.includes('Screens')) { debugger; }

    if(node.name !== '') {
      console.log('EXPANDED: ', node.name, node.parentPath)
      this.expanded_nodes.add(node.path);
    }

    console.log('list of expanded nodes', this.expanded_nodes)
  }

  collapseNode(node: SerializedNode): void {
    this.expanded_nodes.delete(node.path);
    console.log('list of expanded nodes', this.expanded_nodes)
  }

  collapseAllNodes(): void {
    this.expanded_nodes.clear();
  }

  isExpanded(node: SerializedNode): boolean {
    //if(node.name.includes('Screens')) { debugger; }
    return this.expanded_nodes.has(node.path);
  }

  isParentRendered(node: SerializedNode): boolean {
    // console.log('is parent rendered', node.parentPath, this.appConfig.getFileSystemDelimiter())
    if(!this.expanded_nodes.has(node.parentPath)) {  }
    return this.expanded_nodes.has(node.parentPath);
  }

  getNodeSize(node: SerializedNode): string {
    return this.pp.pretty_print_file_size(node.size);
  }

  getNodeProgress(node: SerializedNode): string {
    return (node.progress * 100).toFixed(2);
  }

}
