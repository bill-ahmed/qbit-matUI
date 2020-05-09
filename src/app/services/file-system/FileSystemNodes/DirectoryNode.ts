import Inode, { InodeConstructor } from './Inode';
import FileNode from './FileNode';
import { SerializableNode } from 'src/utils/file-system/interfaces';
import FileSystemType from '../Statics/FileSystemTypes';

/** A class to represent a folder/directory.  */
export default class DirectoryNode extends Inode implements SerializableNode {
  parent: DirectoryNode;
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

  /**
   * @override Need this to method overrided in order to resolve typescript errors
   */
  public getChildren(): Inode[] {
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
    if(this.type !== 'FileNode') {
      this.children.forEach(child => {
        progress += child.getProgressAmount();
        });

        // Average out the progress
        if(this.children.length > 0) { progress = progress / this.children.length }
      }
    else {
      progress = this.progress;
    }

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
}

export interface DirectoryNodeConstructor extends InodeConstructor {  }
