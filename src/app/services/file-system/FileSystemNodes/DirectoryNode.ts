import Inode, { InodeConstructor } from './Inode';
import FileNode from './FileNode';

/** A class to represent a folder/directory.  */
export default class DirectoryNode extends Inode {
  constructor(options: DirectoryNodeConstructor) {
    super(options);
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
    }
  }
}

export interface DirectoryNodeConstructor extends InodeConstructor {  }
