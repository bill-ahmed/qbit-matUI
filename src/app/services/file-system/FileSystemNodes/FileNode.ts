import Inode, { InodeConstructor } from "./Inode";
import { FileNoChildrenError } from '../Exceptions/FileSystemExceptions';
import { SerializableNode } from 'src/utils/file-system/interfaces';

/** A class to represent a file. A file may not have any children. */
export default class FileNode extends Inode implements SerializableNode{
  children: null;
  type = 'FileNode';

  constructor(options:FileNodeConstructor) {
    super(options);

    this.children = null;
  }

  /**
   * @override Need this to method overrided in order to resolve typescript errors
   */
  public getChild(val: any): any {
    throw new FileNoChildrenError();
  }

  /**
   * @override Need this to method overrided in order to resolve typescript errors
   */
  public getChildren(): Inode[] {
    throw new FileNoChildrenError();
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
