import TreeNode, { TreeNodeConstructor } from "../TreeNode";
import { SerializableNode } from 'src/utils/file-system/interfaces';
import FileSystemType from '../Statics/FileSystemTypes';
import { InvalidNameError } from '../Exceptions/FileSystemExceptions';

/** A class to represent object in a File System. */
export default class Inode extends TreeNode implements SerializableNode {

  value: string;
  progress: number;
  children: Inode[];
  parent: Inode;
  size: number;
  type = FileSystemType.InodeType;

  public static VALID_NAME_REGEX = /^[-\w^&'@{}[\],$=!#():.%+~ ]+$/;

  constructor(options: InodeConstructor) {
    super(options);

    if(!options.skipNameValidation) { this.validateName(); }

    this.progress = options.progress || 1;              // Assume file is fully downloaded otherwise
    this.size = options.size || 0;
  }

  /** Download progress of a file/folder as fraction between 0 and 1.
   * Multiply by 100 to get the percentage.
   */
  getProgressAmount(): number {
    return this.progress;
  }

  /**
   * @override Need this to method overrided in order to resolve typescript errors
   */
  getParent(): Inode {
    return this.parent;
  }

  public getSize(): number {
    return this.size;
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

  /** Get path to this file/directory.
   * Is calculated by combining value of all it's ancestors and itself, and
   * joining by the file system delimiter.
   *
   * E.g. "C:/Users/user_1/Desktop", "D:/Images/Ubuntu_LTS_1.iso", etc.
   * @param delimiter The file delimiter to use when joining the path
   * @returns A path that uniquely defines this file/directory.
   */
  public getAbsolutePath(delimiter: string): string {
    if(this.parent) {
      return this.parent.getAbsolutePath(delimiter) + this.value + delimiter;
    }
    return this.value
  }

  public hasChildren(): boolean {
    return this.children && this.children.length > 0;
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

  /** Validate the name of a file/folder.
   * If the name is invalid, an exception is thrown
   * @param name The name of the file/folder
   * @returns true iff the name is valid
   * @throws InvalidNameError
   */
  public validateName(): boolean {
    if(Inode.VALID_NAME_REGEX.test(this.value)) {
      return true;
    } else {
      console.log("validation failed for:", this.value);
      throw new InvalidNameError(this.value);
    }
  }

  public static GetChildFromChildrenList(children: Inode[], child: Inode): Inode {
    return super.GetChildFromChildrenList(children, child) as Inode;
  }
}

export interface InodeConstructor extends TreeNodeConstructor{
  children?: Inode[],
  progress?: number,
  /** Whether to skip name validation or not.
   * DANGEROUS -- USE WITH CAUTION!
   */
  skipNameValidation?: boolean
}
