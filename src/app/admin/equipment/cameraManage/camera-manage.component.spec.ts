import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraManageComponent } from './camera-manage.component';

describe('CameraManageComponent', () => {
  let component: CameraManageComponent;
  let fixture: ComponentFixture<CameraManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
