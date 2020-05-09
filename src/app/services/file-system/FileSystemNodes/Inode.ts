import TreeNode, { TreeNodeConstructor } from "../TreeNode";
import { SerializableNode } from 'src/utils/file-system/interfaces';

/** A class to represent object in a File System. */
export default class Inode extends TreeNode implements SerializableNode {

  progress: number;
  children: Inode[];
  parent: Inode;
  type = 'Inode';

  constructor(options: InodeConstructor) {
    super(options);

    this.progress = options.progress || 1;              // Assume file is fully downloaded otherwise

    if(this.progress !== 0) { this._propogateProgressChange(); }
  }

  /** Download progress of a file/folder as fraction between 0 and 1.
   * Multiply by 100 to get the percentage.
   */
  getProgressAmount(): number {
    return this.progress;
  }

  setProgressAmount(val: number) {
    this.progress = val;
    this._propogateProgressChange();
  }

  /**
   * @override Need this to method overrided in order to resolve typescript errors
   */
  getParent(): Inode {
    return this.parent;
  }

  /**
   * @override Need this to method overrided in order to resolve typescript errors
   */
  public getChild(val: any): Inode {
    return super.getChild(val) as Inode;
  }

  /**
   * @override Need this to method overrided in order to resolve typescript errors
   */
  public getChildren(): Inode[] {
    return this.children;
  }

  /**
   * @override
   */
  public addChild(childValue: any): void {
    let newNode = new Inode({value: childValue});
    this.addChildNode(newNode);
  }

  /**
   * @override
   */
  public addChildNode(child: Inode): void {
    if(!this.hasChild(child.value)) {
      child.setParent(this);
      this.children.push(child);
    }
  }

  /** When this folder/file is modified, we need to propogate it's size all the way to the root
  * This is likely more efficient than calculating the size recursively each time.
  */
 private _propogateProgressChange(): void {
   let progress = 0;
   let old_progress = this.progress;

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
    while(curr != null) {
      curr.setProgressAmount(curr.getProgressAmount() + (this.progress - old_progress));
      curr = curr.getParent();
    }
  }

  public static GetChildFromChildrenList(children: Inode[], child: Inode): Inode {
    return super.GetChildFromChildrenList(children, child) as Inode;
  }
}

export interface InodeConstructor extends TreeNodeConstructor{
  children?: Inode[],
  progress?: number
}
