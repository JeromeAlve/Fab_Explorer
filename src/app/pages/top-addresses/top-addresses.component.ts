import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddressBalance } from '../../core/models';
import { ApiService } from '../../core/services';

@Component({
  selector: 'app-top-addresses',
  templateUrl: './top-addresses.component.html',
  styleUrls: ['./top-addresses.component.css']
})
export class TopAddressesComponent implements OnInit {
  topAddresses: AddressBalance[];
  itemsPerPage = 10;
  rotate = true;
  maxPagesDisplayed = 5;
  totalNum: number;

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.spinner.show();
    this.api.getTopAddresses()
      .subscribe(
        data => {
          this.topAddresses = data.result;
          this.totalNum = data.totalAddrNum;
          this.spinner.hide();
        },
        _ => this.spinner.hide()
      );
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.api.getTopAddresses(startItem, endItem)
      .subscribe(
        data => {
          this.topAddresses = data.result;
          this.totalNum = data.totalAddrNum;
          this.spinner.hide();
        },
        _ => this.spinner.hide()
      );
    this.topAddresses.slice(startItem, endItem);
  }

}
