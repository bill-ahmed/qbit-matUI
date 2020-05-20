import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveTorrentsDialogComponent } from './move-torrents-dialog.component';

describe('MoveTorrentsDialogComponent', () => {
  let component: MoveTorrentsDialogComponent;
  let fixture: ComponentFixture<MoveTorrentsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveTorrentsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveTorrentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
