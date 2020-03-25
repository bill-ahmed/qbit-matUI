import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  private root: TreeNode;

  constructor() { 
    this.root = new TreeNode("");

    console.log(this.root.getChildren(), this.root.getValue());
  }
}
