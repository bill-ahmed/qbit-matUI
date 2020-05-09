import Inode, { InodeConstructor } from "./Inode";
import { FileNoChildrenError } from '../Exceptions/FileSystemExceptions';

/** A class to represent a file. A file may not have any children. */
export default class FileNode extends Inode{
  children: null;

  constructor(options:FileNodeConstructor) {
    options.children = null;  /** Enfore not having children */
    super(options);

    this.children = null;
  }

  /**
   * @override
   */
  public addChild(childValue: any): void {
    throw new FileNoChildrenError();
  }

  /**
   * @override
   */
  public addChildNode(child: FileNode): void {
    throw new FileNoChildrenError();
  }
}

export interface FileNodeConstructor extends InodeConstructor {
  children?: null  /** Cannot have children, by definition */
}
