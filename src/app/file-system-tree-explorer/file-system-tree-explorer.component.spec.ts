import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSystemTreeExplorerComponent } from './file-system-tree-explorer.component';

describe('FileSystemTreeExplorerComponent', () => {
  let component: FileSystemTreeExplorerComponent;
  let fixture: ComponentFixture<FileSystemTreeExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSystemTreeExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSystemTreeExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
