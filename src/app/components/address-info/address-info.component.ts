import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddressInfo } from '../../core/models/address.model';
import { ApiService } from '../../core/services';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.css']
})
export class AddressInfoComponent implements OnInit {
  @Input() address: AddressInfo;

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService
  ) {
  }

  ngOnInit() {
  }

  loadAllTransactions() {
    this.spinner.show();
    this.api.getAddressTransactions(this.address.address)
      .subscribe(
        res => {
          this.address.transactions = res.utxos === null ? [] : res.utxos;
          this.spinner.hide();
        },
        _ => this.spinner.hide()
      );
  }
}
