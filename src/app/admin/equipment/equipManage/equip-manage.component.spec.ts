import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipManageComponent } from './equip-manage.component';

describe('EquipManageComponent', () => {
  let component: EquipManageComponent;
  let fixture: ComponentFixture<EquipManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
