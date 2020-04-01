import { Injectable } from '@angular/core';
import TreeNode from './TreeNode';
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
   * 
   * E.g. dir = ["C:/Users/Dayman/Downloads", "C:/Users/Dayman/Downloads/Temp Folder", "D:/Images"]
   */
  public populateFileSystem(dirs: string[]): void {
    
    // For each directory, we need to extract all the folders in it
    dirs.forEach( (dir: string) => this.createDirectoryPath(dir) );
  }

  /** Given a directory (file path), create all the necessary directories for it
   * 
   * E.g. if dir = "C:/Downloads/Images", then the directory "C:" containing "Downloads" containing "Images" will be created.
   */
  private createDirectoryPath(filePath: string): void {
    let dirsToCreate = filePath.split(this.directoryDelimeter);
    dirsToCreate = dirsToCreate.filter(elem => {return !!elem});
    let curr: TreeNode = this.root;

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

  /** Print entire contents of file system to console log
   * 
   * FOR DEBUGGING PURPOSES ONLY!!
   */
  public printFileSystem(startNode?: TreeNode, indent?: number): void {
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

}
