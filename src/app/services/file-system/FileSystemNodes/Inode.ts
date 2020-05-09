import TreeNode, { TreeNodeConstructor } from "../TreeNode";

/** A class to represent object in a File System. */
export default class Inode extends TreeNode {

  progress: number;
  children: Inode[];
  parent: Inode;

  constructor(options: InodeConstructor) {
    super(options);

    this.progress = options.progress || 1;              // Assume file is fully downloaded otherwise
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

    /** When this folder/file is modified, we need to propogate it's size all the way to the root
  * This is likely more efficient than calculating the size recursively each time.
  */
 private _propogateProgressChange(): void {
   let progress = 0;
   let old_progress = this.progress;

   // Only directories have size computed by their children
   if(this.children) {
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
}

export interface InodeConstructor extends TreeNodeConstructor{
  children: Inode[],
  progress?: number
}
