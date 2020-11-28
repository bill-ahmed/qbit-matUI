import { Directive, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';

/** A directive to handle drag & drop actions
 * Taken mostly from: https://medium.com/@tarekabdelkhalek/how-to-create-a-drag-and-drop-file-uploading-in-angular-78d9eba0b854
 */
@Directive({
  selector: '[appDragAndDropFiles]'
})
export class DragAndDropFilesDirective {
  /** Keep track of when user hovers over input with files */
  @HostBinding('class.fileover') fileOver: boolean;

  /** The actual files recently dragged & dropped */
  @Output() fileDropped = new EventEmitter<any>();

  /** Empty */
  constructor() { }

  // Listen for when user begins dragging over container
  @HostListener('dragover', ['$event'])
  public onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = true;
  }

  // Listen for when user stops dragging files over container
  @HostListener('dragleave', ['$event'])
  public onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = false;
  }

  // Listen for dropped action
  @HostListener('drop', ['$event'])
  public onDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    this.fileOver = false;

    let isValid = true;

    // Format a new $event object
    let files = event.dataTransfer?.files as any;
    let newEvent = {
      target: {
        files: files
      }
    };

    // Validate that we received only .torrent files!
    for(const file of files) {
      if(!(file.name as string).endsWith('.torrent')) { isValid = false; break; }
    }

    if(isValid && files.length > 0) {
      this.fileDropped.emit(newEvent);
    }
  }
}
