import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddressInfo } from '../../core/models/address.model';
import { flatMap } from 'rxjs/operators';
import { ApiService } from '../../core/services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  info: AddressInfo = {
    address: '',
    coinAmount: 0,
    transactions: null
  };

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.spinner.show();
    this.route.params.pipe(
      flatMap(params => {
        console.log(params);
        this.info.address = params.address;
        return this.api.getAddressUTXOs(params.address);
      })
    ).subscribe(
      res => {
        let coinAmount = 0;
        res.forEach(utxo => coinAmount += utxo.value);
        this.info.transactions = res;
        this.info.coinAmount = coinAmount;
        this.spinner.hide();
      }
    );
  }

}
