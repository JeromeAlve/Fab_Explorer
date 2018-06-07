import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressTransactionDetailComponent } from './address-transaction-detail.component';

describe('AddressTransactionDetailComponent', () => {
  let component: AddressTransactionDetailComponent;
  let fixture: ComponentFixture<AddressTransactionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressTransactionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
