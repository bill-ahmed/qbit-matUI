import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FileSystemService, SerializedNode } from '../services/file-system/file-system.service';
import TreeNode from '../services/file-system/TreeNode';

@Component({
  selector: 'app-file-system-tree-explorer',
  templateUrl: './file-system-tree-explorer.component.html',
  styleUrls: ['./file-system-tree-explorer.component.css']
})
export class FileSystemTreeExplorerComponent implements OnChanges {
  @Input() directories: string[];

  public isLoading = true;

  /** Controls for tree components */
  public treeControl = new NestedTreeControl<SerializedNode>(node => node.children);
  public dataSource = new MatTreeNestedDataSource<SerializedNode>();

  private root: TreeNode = new TreeNode("");                /** File System to keep track of the files in a torrent */
  private serialized_root: SerializedNode[] = [];

  constructor(private fs: FileSystemService) { }

  ngOnInit(): void {
    let dirs = this.directories;
    console.log(dirs);
    this.fs.populateFileSystem(dirs, this.root);
    this.fs.SerializeFileSystem(this.root).then(res => { this.serialized_root = res; console.log("got serialized", res) });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.directories) {
      this.directories = changes.directories.currentValue;
    }
  }



}
