import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSystemDialogComponent } from './file-system-dialog.component';

describe('FileSystemDialogComponent', () => {
  let component: FileSystemDialogComponent;
  let fixture: ComponentFixture<FileSystemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSystemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSystemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
