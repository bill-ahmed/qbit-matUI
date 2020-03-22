import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUpdateTorrentsComponent } from './bulk-update-torrents.component';

describe('BulkUpdateTorrentsComponent', () => {
  let component: BulkUpdateTorrentsComponent;
  let fixture: ComponentFixture<BulkUpdateTorrentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUpdateTorrentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUpdateTorrentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
