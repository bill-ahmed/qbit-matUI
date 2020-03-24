import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentInfoDialogComponent } from './torrent-info-dialog.component';

describe('TorrentInfoDialogComponent', () => {
  let component: TorrentInfoDialogComponent;
  let fixture: ComponentFixture<TorrentInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
