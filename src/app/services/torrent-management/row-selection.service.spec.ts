import { TestBed } from '@angular/core/testing';

import { RowSelectionService } from './row-selection.service';

describe('RowSelectionService', () => {
  let service: RowSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RowSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
