import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddressInfo } from '../../core/models';
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
        this.info.address = params.address;
        return this.api.getAccountBalance(params.address);
      })
    ).subscribe(
      res => {
        this.info.coinAmount = res.balance;
        this.spinner.hide();
      }
    );
  }
}
