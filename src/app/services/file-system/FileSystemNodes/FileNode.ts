import Inode, { InodeConstructor } from "./Inode";
import { FileNoChildrenError } from '../Exceptions/FileSystemExceptions';
import { SerializableNode } from 'src/utils/file-system/interfaces';
import DirectoryNode from './DirectoryNode';
import FileSystemType from '../Statics/FileSystemTypes';

/** A class to represent a file. A file may not have any children. */
export default class FileNode extends Inode implements SerializableNode{
  parent: DirectoryNode;
  children: null;
  type = FileSystemType.FileNodeType;

  constructor(options:FileNodeConstructor) {
    super(options);

    this.children = null;
  }

  public setProgressAmount(val: number) {
    this.progress = val;
    this._propogateProgressChange();
  }

  public setSize(val: number) {
    this.size = val;
    this._propogateSizeChange();
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

  /** When this folder/file is modified, we need to propogate it's size all the way to the root
  * This is likely more efficient than calculating the size recursively each time.
  */
  private _propogateProgressChange(): void {
    this.parent.refreshProgress();
  }

  /** When this folder/file is modified, we need to propogate it's size all the way to the root
    * This is likely more efficient than calculating the size recursively each time.
    */
  private _propogateSizeChange(): void {
    this.parent.refreshSize();
  }

}

export interface FileNodeConstructor extends InodeConstructor {
  children?: null  /** Cannot have children, by definition */
}
