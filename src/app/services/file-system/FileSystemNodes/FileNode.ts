import Inode, { InodeConstructor } from "./Inode";

/** A class to represent a file. A file may not have any children. */
export default class FileNode extends Inode{
  children: null;

  constructor(options:FileNodeConstructor) {
    options.children = null;  /** Enfore not having children */
    super(options);

    this.children = null;
  }
}

export interface FileNodeConstructor extends InodeConstructor {
  children: null  /** Cannot have children, by definition */
}
