import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCompareComponent } from './data-compare.component';

describe('DataCompareComponent', () => {
  let component: DataCompareComponent;
  let fixture: ComponentFixture<DataCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
