import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAddressesComponent } from './top-addresses.component';

describe('TopAddressesComponent', () => {
  let component: TopAddressesComponent;
  let fixture: ComponentFixture<TopAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopAddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
