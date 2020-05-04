import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FileSystemService, SerializedNode } from '../services/file-system/file-system.service';
import TreeNode, { AdvancedNode } from '../services/file-system/TreeNode';

@Component({
  selector: 'app-file-system-tree-explorer',
  templateUrl: './file-system-tree-explorer.component.html',
  styleUrls: ['./file-system-tree-explorer.component.css']
})
export class FileSystemTreeExplorerComponent implements OnChanges {
  @Input() directories: AdvancedNode[];

  public isLoading = true;

  /** Controls for tree components */
  public treeControl = new NestedTreeControl<SerializedNode>(node => node.children);
  public dataSource = new MatTreeNestedDataSource<SerializedNode>();

  private root: TreeNode;                           /** File System to keep track of the files in a torrent */
  private serialized_root: SerializedNode[] = [];

  constructor(private fs: FileSystemService) { }

  ngOnInit(): void {
    this._updateData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.directories) {
      this.directories = changes.directories.currentValue;
      this._updateData();
    }
  }

  /** Refresh all filesystem data. This could potentially be an
   *  expensive operation.
   */
  private async _updateData(): Promise<void> {
    this.root = new TreeNode("");

    this.fs.populateFileSystemWithAdvancedOptions(this.directories, this.root);
    this.fs.SerializeFileSystem(this.root).then(data => {
      console.log(data);
      this.serialized_root = data;
      this.dataSource.data = data;
    });

  }

  public hasChild(_: number, node: SerializedNode) {
    return !!node.children && node.children.length > 0
  }

}
