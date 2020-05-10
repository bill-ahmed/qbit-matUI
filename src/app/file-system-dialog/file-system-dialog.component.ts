import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileDirectoryExplorerService } from '../services/file-system/file-directory-explorer.service';
import TreeNode from '../services/file-system/TreeNode';
import { ThemeService } from '../services/theme.service';
import { Observable } from 'rxjs';
import Inode from '../services/file-system/FileSystemNodes/Inode';
import { FileSystemService } from '../services/file-system/file-system.service';
import { DirectoryNotFoundError } from '../services/file-system/Exceptions/FileSystemExceptions';
import DirectoryNode from '../services/file-system/FileSystemNodes/DirectoryNode';
import FileNode from '../services/file-system/FileSystemNodes/FileNode';

@Component({
  selector: 'app-file-system-dialog',
  templateUrl: './file-system-dialog.component.html',
  styleUrls: ['./file-system-dialog.component.scss']
})
export class FileSystemDialogComponent implements OnInit {

  public filePath: string[] = [];
  public root: DirectoryNode;
  public leftChildren: DirectoryNode[] = [];                 // Keep track of what folders to show in left nav
  public rightChildren: (DirectoryNode | FileNode)[] = [];
  public selectedDir: DirectoryNode = null;                  // Keep track of what folder the user last selected (i.e. what folder they're currently in)
  public isDarkTheme: Observable<boolean>;
  public isCreatingNewFolder: boolean = false;       // Keep track of when user wants to create a new folder

  private newDirValue: string = ""                   // Name of new folder to create
  private inputData: any;                            // Data passed in to this component

  constructor(private dialogRef:MatDialogRef<FileSystemDialogComponent>, private fs: FileDirectoryExplorerService, private fs_service: FileSystemService,
              private theme: ThemeService, @Inject(MAT_DIALOG_DATA) inputData) { this.inputData = inputData; }

  ngOnInit(): void {
    this.isDarkTheme = this.theme.getThemeSubscription();
    this.root = this.fs.getFileSystem();
    this.leftChildren = this.root.getChildren() as DirectoryNode[];
    this.leftChildren.sort(TreeNode.sort());

    this._openToInitialFolder();
    console.log("file path", this.inputData.initialFilePath);
  }

  public closeDialog(): void {
    if(this.filePath.length > 0) {
      let fp = this.filePath.join(this.fs_service.getFileSystemDelimeter());
      this.dialogRef.close(fp);
    } else {
      this.dialogRef.close();
    }
  }

  /** Go to chosen child directory */
  public navigateToDir(dir: DirectoryNode, type: string): void {

    this.cancelFolderCreation();

    // Refresh children shown in right panel
    if(type === "parent") {
      if(this.rightChildren) {
        this.filePath.pop();
      }

      let dirChosen = DirectoryNode.GetChildFromChildrenList(this.leftChildren, dir);
      this.rightChildren = dirChosen.getChildren();

      this.rightChildren.sort(TreeNode.sort());
    }
    else if(type === "child") {

      this.leftChildren = this.rightChildren as DirectoryNode[];

      let dirChosen = DirectoryNode.GetChildFromChildrenList(this.rightChildren, dir);
      this.rightChildren = dirChosen.getChildren();
      this.rightChildren.sort(TreeNode.sort());
    }

    this.filePath.push(dir.getValue());
    this.selectedDir = dir;
  }

  public navigateUp(): void {
    this.filePath.pop();

    let parent = this.leftChildren[0].getParent();

    // If parent is not root, continue
    if(parent.getParent()) {
      this.rightChildren = this.leftChildren;
      this.leftChildren = parent.getParent().getChildren() as DirectoryNode[];

      this.leftChildren.sort(TreeNode.sort());
      this.rightChildren.sort(TreeNode.sort());

      this.selectedDir = parent;
    } else {
      // We're trying to go up to far, so reset the file explorer to how it looked initially
      this.selectedDir = null;
      this.rightChildren = [];
    }
  }

  /** Create a new folder with given name in current directory */
  public createFolder(): void {
    let name = this.newDirValue.trim();

    if(name === "") {
      alert("Folder name can't be empty!");
      return;
    }

    if (this.selectedDir != null) { this.selectedDir.addChild(name); }
    else { alert("Can't create a directory at the root!"); }

    this.cancelFolderCreation();
    this.rightChildren.sort(TreeNode.sort());
  }

  /** Callback for when user decides to create a new folder */
  public handleCreateFolderAction(): void {
    this.isCreatingNewFolder = true;
  }

  public handleFolderNameChange(event: any): void {
    this.newDirValue = event.target.value;

    // Handle Enter button press
    if (event.key === "Enter") { this.createFolder(); }
  }

  /** Stop user from creating a directory */
  public cancelFolderCreation(): void {
    this.newDirValue = "";
    this.isCreatingNewFolder = false;
  }

  public rightPanelHasContent(): boolean {
    return this.rightChildren.length === 0;
  }

  public getFilePath(): string {
    return this.filePath.length === 0 ? "{ Unchanged }" : this.filePath.join(this.fs_service.getFileSystemDelimeter());
  }

  public isDirectorySelected(dir: Inode) {
    if(this.selectedDir) {
      return this.selectedDir.getValue() === dir.getValue();
    }
    return false;
  }

  /**Get the number of children a directory has, as a string
   * @param dir The directory to examine
   *
   * E.g. "1 subfolder", "3 subfolders"
   */
  public getNumChildrenString(dir: Inode): string {
    let len = dir.getChildren().length
    return len < 1 ? `Empty` : len === 1 ? `1 subfolder` : `${len} subfolders`
  }

  /** Open the file system explorer to the initial folder passed in.
   * If no such folder exists, we will open the root instead.
   */
  private _openToInitialFolder(): void {
    let path = this.inputData.initialFilePath;
    if (!path) { return; }

    // Try opening file system to folder represented by the given path
    try {
      let new_root = FileSystemService.GetDirectoryByAbsolutePath(this.root, path, this.fs_service.getFileSystemDelimeter());
      this.leftChildren = new_root.getParent().getChildren() as DirectoryNode[];
      this.rightChildren = new_root.getChildren();
      this.selectedDir = new_root;

    } catch (error) {
      if(error instanceof DirectoryNotFoundError) {
        console.log("Couldn't open to folder:", path);
      } else{
        throw error;    /** Let all others bubble up */
      }
    }
  }

}
