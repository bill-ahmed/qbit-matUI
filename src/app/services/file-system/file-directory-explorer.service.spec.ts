import { TestBed } from '@angular/core/testing';

import { FileDirectoryExplorerService } from './file-directory-explorer.service';

describe('FileDirectoryExplorerService', () => {
  let service: FileDirectoryExplorerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileDirectoryExplorerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
