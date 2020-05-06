export default class TreeNode {
    private value: any = null;
    private parent: TreeNode = null;
    private children: TreeNode[] = [];

    private type: TreeNodeType = "Directory";   // Defaults to a folder
    private size: number = 0;                   // Size of node, commonly in bytes
    private progress: number = 0;             // How much of a file has been saved to disk

    constructor(value: any, children?: TreeNode[], type?: TreeNodeType, size?: number, progress?: number) {
        this.value = value;

        // Optional params
        this.type = type || this.type;
        this.size = size || this.size;
        this.progress = progress || 1;              // Assume file is fully downloaded otherwise
        this.children = children || this.children;

        if (this.size !== 0 || this.progress !== 0) { this._propogateSizeChange(); }
    }

    public getParent(): TreeNode {
        return this.parent;
    }

    public setParent(par: TreeNode): void {
        this.parent = par;
        this._propogateSizeChange();
    }

    public getValue(): any {
        return this.value;
    }

    public setValue(val: string): void {
      this.value = val;
    }

    public getChildren(): TreeNode[] {
        return this.children
    }

    public getSize(): number {
      return this.size;
    }

    public setSize(size: number): void {
      this.size = size;
      this._propogateSizeChange();
    }

    /** Download progress of a file/folder as fraction between 0 and 1.
     * Multiply by 100 to get the percentage.
     */
    getProgressAmount(): number {
      return this.progress;
    }

    setProgressAmount(val: number) {
      this.progress = val;
      this._propogateSizeChange();
    }

    public getType(): TreeNodeType {
      return this.type;
    }

    /** Get a pointer to a child with given value. If no such child exists, null is returned*/
    public getChild(val: any): TreeNode {
        for(const child of this.children){
            if (child.value === val) { return child; }
        }
        return null;
    }

    /** Given a value of a child, add them along with other children. Will do nothing if child with
     * given value already exists (using ===)
     * @param childValue The value of the child to add
    */
    public addChild(childValue: any): void {
        let newNode = new TreeNode(childValue);
        this.addChildNode(newNode);
    }

    /** Add a node to the tree.  Will do nothing if child with same value already exists (using ===)
     * @param child The new child to add
     */
    public addChildNode(child: TreeNode): void {
        if(!this.hasChild(child.value)) {
            child.setParent(this);
            this.children.push(child);
            this._propogateSizeChange();
        }
    }

    /** Determine if this node already has a child with given value (uses === comparison)
     * True iff the child exists, false otherwise.
     *
     * @param children The group of children to check in
     * @param val The value of the child to look for
     *
     * */
    public hasChild(val: any): boolean {
        for(const child of this.children){
            if (child.value === val) { return true; }
        }
        return false;
    }

    /** Removes all instances of a child with given value from the set of children using "===" comparison.
     * @param childValue The value of the child to remove
     */
    public removeChild(childValue: any): void {
        this.children = this.children.filter((elem: TreeNode) => {elem.value !== childValue})
        this._propogateSizeChange();
    }

    /** Private */

    /** When this folder/file is modified, we need to propogate it's size all the way to the root
     * This is likely more efficient than calculating the size recursively each time.
    */
    private _propogateSizeChange(): void {
      let size = 0;
      let progress = 0;

      let old_size = this.size;
      let old_progress = this.progress;

      // Only directories have size computed by their children
      if(this.type === "Directory") {
        this.children.forEach(child => {
          size += child.getSize();
          progress += child.getProgressAmount();
        });

        // Average out the progress
        if(this.children.length > 0) { progress = progress / this.children.length }
      }
      else {
        size = this.size;
        progress = this.progress;
      }

      this.size = size;
      this.progress = progress;

      // Update sizes of parent & all ancestors
      let curr = this.parent;
      while(curr != null) {
        curr.setSize(curr.getSize() + (this.size - old_size));
        curr.setProgressAmount(curr.getProgressAmount() + (this.progress - old_progress));
        curr = curr.getParent();
      }
    }


    /** Static Methods */

    public static sort() {
        return function(a: TreeNode, b: TreeNode) {
            if(a.value > b.value) {
                return 1;
            } else if (a.value < b.value) {
                return -1;
            }
            return 0;
        }
    }

    public static GetChildFromChildrenList(children: TreeNode[], child: TreeNode): TreeNode {
        for(const ch of children) {
            if(ch.value === child.value) {
                return ch;
            }
        }
        return null;
    }
}

export type TreeNodeType = "Directory" | "File"

/** This type of node can have many important properties */
export interface AdvancedNode {
  name: string,
  type: TreeNodeType,
  size: number,
  /** A file not me fully ready. This can represent how much has been saved to disk. */
  progress: number,
}
