import Inode, { InodeConstructor } from './Inode';
import FileNode from './FileNode';

/** A class to represent a folder/directory.  */
export default class DirectoryNode extends Inode {
  constructor(options: DirectoryNodeConstructor) {
    super(options);
  }
}

export interface DirectoryNodeConstructor extends InodeConstructor {
  children?: DirectoryNode[] | FileNode[]
 }
