import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSnackbarComponent } from './info-snackbar.component';

describe('InfoSnackbarComponent', () => {
  let component: InfoSnackbarComponent;
  let fixture: ComponentFixture<InfoSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
