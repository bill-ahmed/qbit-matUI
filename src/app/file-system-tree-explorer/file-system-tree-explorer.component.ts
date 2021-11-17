import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
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
  @Input() allowSetPriority: boolean = false;

  /** When user changes the priority */
  @Output() onPriorityChange = new EventEmitter<SerializedNode>();

  /** When user toggles the drop-down menu in order to choose a priority */
  @Output() onPriorityChangeToggled = new EventEmitter();

  public isLoading = true;

  /** Controls for tree components */
  public treeControl = new NestedTreeControl<SerializedNode>(node => node.children);
  public dataSource = new MatTreeNestedDataSource<SerializedNode>();

  public file_priorities = ApplicationConfigService.FILE_PRIORITY_OPTS;
  public file_priorities_mapping = ApplicationConfigService.FILE_PRIORITY_OPTS_MAPPING;

  private root: DirectoryNode;                           /** File System to keep track of the files in a torrent */

  private expanded_nodes: Set<string> = new Set<string>();
  private nodes_to_render: Set<string> = new Set<string>();

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

    if(changes.showProgress) { this.showProgress = changes.showProgress.currentValue; }
    if(changes.allowSetPriority) { this.allowSetPriority = changes.allowSetPriority.currentValue }
  }

  handleCheckboxClick(node: SerializedNode) {
    let o = node.priority;
    node.priority = o === 0 ? 1 : 0

    this.onPriorityChange.emit(node);
  }
  handleFilePriorityChange(node: SerializedNode) { this.onPriorityChange.emit(node); }
  handleFilePriorityToggled() { this.onPriorityChangeToggled.emit(''); }

  /** Refresh all filesystem data. This could potentially be an
   *  expensive operation.
   */
  private async _updateData(): Promise<void> {
    this.dataSource = new MatTreeNestedDataSource<SerializedNode>();
    this.dataSource.data = this.directories;

    /** Should render the root node, which basically shows the top-level torrents */
    this.nodes_to_render.add('');
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
    this.expanded_nodes.add(node.path);
    this.nodes_to_render.add(node.path);
  }

  collapseNode(node: SerializedNode): void {
    this.expanded_nodes.delete(node.path);
    /** Do not remove node from nodes_to_render! Want to keep it rendered
     * to avoid having to re-create it from subsequent collapse/expand
     */
  }

  collapseAllNodes(): void {
    this.expanded_nodes.clear();
  }

  isExpanded(node: SerializedNode): boolean {
    return this.expanded_nodes.has(node.path);
  }

  isParentRendered(node: SerializedNode): boolean {
    return this.nodes_to_render.has(node.parentPath);
  }

  getNodeSize(node: SerializedNode): string {
    return this.pp.pretty_print_file_size(node.size);
  }

  getNodeProgress(node: SerializedNode): string {
    return (node.progress * 100).toFixed(2);
  }

}
