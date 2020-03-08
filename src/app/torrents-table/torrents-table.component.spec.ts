import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentsTableComponent } from './torrents-table.component';

describe('TorrentsTableComponent', () => {
  let component: TorrentsTableComponent;
  let fixture: ComponentFixture<TorrentsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorrentsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
