import Inode, { InodeConstructor } from './Inode';
import FileNode from './FileNode';
import { SerializableNode } from 'src/utils/file-system/interfaces';
import FileSystemType from '../Statics/FileSystemTypes';

/** A class to represent a folder/directory.  */
export default class DirectoryNode extends Inode implements SerializableNode {
  parent: DirectoryNode;
  children: (DirectoryNode | FileNode)[];   // Children can be any combination of DirectoryNode and FileNode together
  type = FileSystemType.DirectoryNodeType;

  constructor(options: DirectoryNodeConstructor) {
    super(options);

    this._propogateProgressChange();
    if (this.size !== 0) { this._propogateSizeChange(); }
  }

  public setSize(val: number): void {
    this.size = val;
    this._propogateSizeChange();
  }

  /**
   * @override Need this to method overrided in order to resolve typescript errors
   */
  public getChild(val: any): DirectoryNode {
    return super.getChild(val) as DirectoryNode;
  }

  /** Gets the subdirectory with given value. If not such directory exists,
   * null is returned.
   *
   * @param val The value of the subdirectory to look for.
   * @returns A directory representing the given value.
   */
  public getDirectory(val: any): DirectoryNode {
    for(const child of this.children) {
      if(child.value === val && child.type === FileSystemType.DirectoryNodeType) {
        return child as DirectoryNode;
      }
    }
    return null;
  }

  /**
   * @override Need this to method overrided in order to resolve typescript errors
   */
  public getChildren(): (DirectoryNode | FileNode)[] {
    return this.children;
  }

  public getParent(): DirectoryNode {
    return super.getParent() as DirectoryNode;
  }

  /**
   * @override
   */
  public addChild(childValue: any): void {
    let newNode = new DirectoryNode({value: childValue});
    this.addChildNode(newNode);
  }

  /**
   * @override
   */
  public addChildNode(child: DirectoryNode): void {
    if(!this.hasChild(child.value)) {
      child.setParent(this);
      this.children.push(child);
      this._propogateProgressChange();
      this._propogateSizeChange();
    }
  }

  public refreshProgress(): void {
    this._propogateProgressChange();
  }

  public refreshSize(): void {
    this._propogateSizeChange();
  }

  /** When this folder/file is modified, we need to propogate it's size all the way to the root
  * This is likely more efficient than calculating the size recursively each time.
  */
  private _propogateProgressChange(): void {
    let progress = 0;

    // Only directories have size computed by their children
    this.children.forEach(child => {
      progress += child.getProgressAmount();
    });

    // Average out the progress
    if(this.children.length > 0) { progress = progress / this.children.length }

    this.progress = progress;

    // Update sizes of parent & all ancestors
    let curr = this.parent;
    if(curr != null) {
      curr.refreshProgress();
    }
  }

  /** When this folder/file is modified, we need to propogate it's size all the way to the root
    * This is likely more efficient than calculating the size recursively each time.
    */
  private _propogateSizeChange(): void {
    let size = 0;
    let old_size = this.size;

    this.children.forEach(child => {
      size += child.getSize();
    });

    this.size = size;

    // Update sizes of parent & all ancestors
    let curr = this.parent;
    if(curr != null) {
      curr.setSize(curr.getSize() + (this.size - old_size));
    }
  }

  public static GetChildFromChildrenList(children: (DirectoryNode | FileNode)[], child: DirectoryNode): DirectoryNode {
    return super.GetChildFromChildrenList(children, child) as DirectoryNode;
  }
}

export interface DirectoryNodeConstructor extends InodeConstructor {  }
