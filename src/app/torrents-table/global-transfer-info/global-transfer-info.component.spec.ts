import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalTransferInfoComponent } from './global-transfer-info.component';

describe('GlobalTransferInfoComponent', () => {
  let component: GlobalTransferInfoComponent;
  let fixture: ComponentFixture<GlobalTransferInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalTransferInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalTransferInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
