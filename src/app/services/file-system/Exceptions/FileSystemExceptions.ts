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

