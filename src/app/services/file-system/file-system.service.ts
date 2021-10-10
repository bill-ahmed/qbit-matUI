import { Injectable } from '@angular/core';
import * as config from '../../../assets/config.json';
import DirectoryNode from './FileSystemNodes/DirectoryNode';
import Inode from './FileSystemNodes/Inode';
import FileNode from './FileSystemNodes/FileNode';
import { DirectoryNotFoundError } from './Exceptions/FileSystemExceptions';
import { ApplicationConfigService } from '../app/application-config.service';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  private root: DirectoryNode;
  private directoryDelimiter = config.filePathDelimeter  // How folders are split

  constructor(private appConfig: ApplicationConfigService) {
    this.root = new DirectoryNode({value: "", skipNameValidation: true});
  }

  public getFileSystem(): DirectoryNode {
    return this.root;
  }

  public getFileSystemDelimeter(): string {
    return this.appConfig.getFileSystemDelimiter() || this.directoryDelimiter;
  }

  public setFileSystemDelimeter(val: string): void {
    this.directoryDelimiter = val;
  }

  /** Given a list of file paths, construct a file-system
   * @param dirs The array of directories
   * @param root The root of the file system to use. If none is specified, existing one will be used.
   *
   * E.g. dirs = ["C:/Users/Dayman/Downloads", "C:/Users/Dayman/Downloads/Temp Folder", "D:/Images"]
   */
  public populateFileSystem(dirs: string[], root?: DirectoryNode): void {

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
  public async populateFileSystemWithAdvancedOptions(dirs: SerializedNode[], root?: DirectoryNode, delimiter?: string) {
    // For each directory, we need to extract all the folders in it
    if(dirs.length > 0) {
      dirs.forEach( async (dir) => await this.createDirectoryPathWithAdvancedData(dir, root || this.root, delimiter || this.directoryDelimiter) );
    }
  }

  /** Given a directory (file path), create all the necessary directories for it
   *
   * E.g. if dir = "C:/Downloads/Images", then the directory "C:" containing "Downloads" containing "Images" will be created.
   */
  private async createDirectoryPath(filePath: string, root: DirectoryNode): Promise<void> {
    let dirsToCreate = filePath.split(this.directoryDelimiter);
    dirsToCreate = dirsToCreate.filter(elem => {return !!elem});
    let curr: DirectoryNode = root;

    // For each directory in the path, create it and move the pointer
    for(const dir of dirsToCreate) {
      if(!curr.hasChild(dir)) {

        let newDirNode = new DirectoryNode({value: dir});

        curr.addChildNode(newDirNode);
        curr = newDirNode;
      } else {
        curr = curr.getChild(dir);
      }
    }
  }

  private createDirectoryPathWithAdvancedData(data: SerializedNode, root: DirectoryNode, delimiter?: string) {
    let dirsToCreate = data.path.split(delimiter || this.directoryDelimiter).filter(elem => {return !!elem});
    let lastElement = dirsToCreate[dirsToCreate.length - 1];
    let curr: DirectoryNode = root;

    // For each directory in the path, create it and move the pointer
    for(const dir of dirsToCreate) {
      if(!curr.hasChild(dir)) {

        let newDirNode: any;

        // If a folder, create directory type
        if(dir === lastElement && data.type === "File") { newDirNode = new FileNode({value: dir, children: null, size: data.size, progress: data.progress, priority: data.priority}); }
        else { newDirNode = new DirectoryNode({value: dir, priority: data.priority}); }

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
  public async SerializeFileSystem(root?: DirectoryNode): Promise<SerializedNode[]> {
    root = root || this.root;
    return await this._convertToJSON(root);
  }

  /** Print entire contents of file system to console log
   *
   * FOR DEBUGGING PURPOSES ONLY!!
   */
  public printFileSystem(startNode?: Inode, indent?: number): void {
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

  private async _convertToJSON(node: Inode): Promise<SerializedNode[]> {
    let result = [];

    if(node.hasChildren()) {
      for(const child of node.getChildren()) {
        result.push({
          name: child.getValue(),
          path: child.getAbsolutePath(this.directoryDelimiter),
          parentPath: node.getAbsolutePath(this.directoryDelimiter),
          children: await this._convertToJSON(child),
          size: child.getSize(),
          progress: child.getProgressAmount(),
          priority: child.priority,
          type: child.type
        });
      }
    }
    return result;
  }

  /** Detect the file path delimiter used in a given path.
   * Very basic method of checking, not recommended for important use.
   *
   * @param path The file path to consider
   * @returns The delimiter that is most likely being used
   */
  public static DetectFileDelimiter(path: string): string {
    // Probability of having backslash character in unix file/folder name is
    // pretty unlikely LOL
    if(path.includes("\\")) {
      console.log("using windows delimiter")
      return "\\";
    }
    console.log("using unix delimiter")
    return "/";
  }

  /** Given an absolute path (e.g. C:/Users/user_1/Desktop), get the
   * directory node that represents it. If no such directory exists, null is returned.
   *
   * @param root The root of the file system
   * @param path The path to the directory.
   * @param delimiter The delimiter the file system uses
   * @returns A directory that represents the given path.
   * @throws DirectoryNotFoundError
   */
  public static GetDirectoryByAbsolutePath(root: DirectoryNode, path: string, delimiter: string): DirectoryNode {
    let curr = root;
    let dirs = path.split(delimiter).filter(elem => {return !!elem});

    for(const dir of dirs) {
      if(!(curr = curr.getDirectory(dir))) {
        // If this child is not found
        throw new DirectoryNotFoundError();
      }
    }

    return curr;
  }

}

export interface SerializedNode {
  name: string,
  path: string,
  parentPath: string,
  size: number,
  progress?: number,
  priority?: number,
  type?: 'File' | 'Directory',
  children?: SerializedNode[]
}
