import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTorrentDialogComponent } from './add-torrent-dialog.component';

describe('AddTorrentDialogComponent', () => {
  let component: AddTorrentDialogComponent;
  let fixture: ComponentFixture<AddTorrentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTorrentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTorrentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
