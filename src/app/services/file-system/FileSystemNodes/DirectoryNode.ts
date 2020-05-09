import Inode, { InodeConstructor } from './Inode';

/** A class to represent a folder/directory.  */
export default class DirectoryNode extends Inode {
  constructor(options: DirectoryNodeConstructor) {
    super(options);
  }
}

export interface DirectoryNodeConstructor extends InodeConstructor { }
