import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTorrentsComponent } from './search-torrents.component';

describe('SearchTorrentsComponent', () => {
  let component: SearchTorrentsComponent;
  let fixture: ComponentFixture<SearchTorrentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTorrentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTorrentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
