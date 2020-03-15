import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTorrentDialogComponent } from './delete-torrent-dialog.component';

describe('DeleteTorrentDialogComponent', () => {
  let component: DeleteTorrentDialogComponent;
  let fixture: ComponentFixture<DeleteTorrentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTorrentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTorrentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
