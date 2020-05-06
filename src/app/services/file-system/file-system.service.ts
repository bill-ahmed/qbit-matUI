import { Injectable } from '@angular/core';
import TreeNode, { TreeNodeType, AdvancedNode } from './TreeNode';
import * as config from '../../../assets/config.json';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  private root: TreeNode;
  private directoryDelimeter = config.filePathDelimeter  // How folders are split

  constructor() {
    this.root = new TreeNode("");
  }

  public getFileSystem(): TreeNode {
    return this.root;
  }

  /** Given a list of file paths, construct a file-system
   * @param dirs The array of directories
   * @param root The root of the file system to use. If none is specified, existing one will be used.
   *
   * E.g. dirs = ["C:/Users/Dayman/Downloads", "C:/Users/Dayman/Downloads/Temp Folder", "D:/Images"]
   */
  public populateFileSystem(dirs: string[], root?: TreeNode): void {

    // For each directory, we need to extract all the folders in it
    if(dirs.length > 0) {
      dirs.forEach( (dir: string) => this.createDirectoryPath(dir, root || this.root) );
    }
  }

  /**
   * Given an array of file paths with advanced data, construct a file system that represents it
   * @param dirs The directories to create, with data such as type and size
   * @param root The root of the file system. If none is specified, existing one will be used.
   */
  public populateFileSystemWithAdvancedOptions(dirs: AdvancedNode[], root?: TreeNode) {
    // For each directory, we need to extract all the folders in it
    if(dirs.length > 0) {
      dirs.forEach( (dir) => this.createDirectoryPathWithAdvancedData(dir, root || this.root) );
    }
  }

  /** Given a directory (file path), create all the necessary directories for it
   *
   * E.g. if dir = "C:/Downloads/Images", then the directory "C:" containing "Downloads" containing "Images" will be created.
   */
  private async createDirectoryPath(filePath: string, root: TreeNode): Promise<void> {
    let dirsToCreate = filePath.split(this.directoryDelimeter);
    dirsToCreate = dirsToCreate.filter(elem => {return !!elem});
    let curr: TreeNode = root;

    // For each directory in the path, create it and move the pointer
    for(const dir of dirsToCreate) {
      if(!curr.hasChild(dir)) {

        let newDirNode = new TreeNode(dir);

        curr.addChildNode(newDirNode);
        curr = newDirNode;
      } else {
        curr = curr.getChild(dir);
      }
    }
  }

  private createDirectoryPathWithAdvancedData(data: AdvancedNode, root: TreeNode) {
    let dirsToCreate = data.name.split(this.directoryDelimeter).filter(elem => {return !!elem});
    let lastElement = dirsToCreate[dirsToCreate.length - 1];
    let curr: TreeNode = root;

    // For each directory in the path, create it and move the pointer
    for(const dir of dirsToCreate) {
      if(!curr.hasChild(dir)) {

        let newDirNode: TreeNode;

        // If a folder, create directory type
        if(dir === lastElement && data.type === "File") { newDirNode = new TreeNode(dir, null, data.type, data.size); }
        else { newDirNode = new TreeNode(dir); }

        curr.addChildNode(newDirNode);
        curr = newDirNode;
      } else {
        curr = curr.getChild(dir);
      }
    }
  }

  /** Serialize a file system into array of objects, where each object
   * represents a folder. The objects can be nested.
   * @param root Start of the file system. If none is specified, the instantiated one
   * belonging to `this` will be used instead.
   */
  public async SerializeFileSystem(root?: TreeNode): Promise<SerializedNode[]> {
    root = root || this.root;
    return this._convertToJSON(root);
  }

  /** Print entire contents of file system to console log
   *
   * FOR DEBUGGING PURPOSES ONLY!!
   */
  public printFileSystem(startNode?: TreeNode, indent?: number): void {
    indent = indent || 1;
    if(startNode) {
      for(const child of startNode.getChildren()) {
        // Print directory with indent
        console.log("\t".repeat(indent) + child.getValue());
        this.printFileSystem(child, indent + 1);
      }

    } else {
      this.printFileSystem(this.root, 0);
    }
  }

  private _convertToJSON(node: TreeNode): SerializedNode[] {
    let result = [];

    for(const child of node.getChildren()) {
      result.push({
        name: child.getValue(),
        children: this._convertToJSON(child),
        type: child.getType(),
        size: child.getSize(),
        downloaded: child.getDownloadedAmount(),
      });
    }
    return result;
  }

}

export interface SerializedNode {
  name: string,
  type: TreeNodeType,
  size: number,
  downloaded: number,
  children?: SerializedNode[]
}
