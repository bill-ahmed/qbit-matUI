export default class FileSystemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileSystemError";
  }
}

export class InvalidSizeError extends FileSystemError {
  constructor(message?: string) {
    super(message || "All file/folder sizes must be greater than or equal to zero.");
    this.name = "InvalidSizeError"
  }
}

export class FileNoChildrenError extends FileSystemError {
  constructor(message?: string) {
    super(message || "A file cannot have any children.");
    this.name = "FileNoChildrenError";
  }
}

export class DirectoryNotFoundError extends FileSystemError {
  constructor(message?: string) {
    super(message || "The directory with given path does not exist.");
    this.name = "DirectoryNotFoundError";
  }
}

export class FileNotFoundError extends FileSystemError {
  constructor(message?: string) {
    super(message || "The file with given path does not exist.");
    this.name = "FileNotFoundError";
  }
}

export class InvalidNameError extends FileSystemError {
  constructor(name: string, message?: string) {
    super(message || `The file name '${name}' contains an invalid character.`);
    this.name = "InvalidNameError";
  }
}

