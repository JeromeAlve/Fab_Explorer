import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../../core/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { flatMap } from 'rxjs/operators';
import { Block, Tx } from '../../core/models';
import { AddressInfo } from '../../core/models/address.model';
import { UtilsService } from '../../core/services/utils.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Output() searchResult = new EventEmitter<{ data: Block | Tx | AddressInfo, type: string }>();
  searchFailed = false;
  displaySearchValue: string;
  searchValue = '';

  constructor(
    private api: ApiService,
    private utils: UtilsService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
  }

  private onResult = (res, type) => {
    this.searchResult.emit({data: res, type: type});
    this.searchFailed = false;
    this.spinner.hide();
  };

  private caughtError = (err) => {
    console.error(err);
    this.searchFailed = true;
    this.displaySearchValue = this.searchValue;
    this.searchResult.emit(null);
    this.spinner.hide();
  };

  onKey(event: any) {
    if (event.keyCode === 13) {
      this.search();
    } else {
      this.searchValue = event.target.value;
    }
  }

  search() {
    this.spinner.show();
    let searchType: string;
    const sanitizedValue = this.searchValue.replace(/[^\w]/g, '');

    if (!isNaN(Number(sanitizedValue))) {
      searchType = 'block';
    } else {
      searchType = UtilsService.checkHashType(sanitizedValue);
    }

    switch (searchType) {
      case 'block':
        this.api.getBlockHash(Number(sanitizedValue))
          .pipe(
            flatMap(hash => this.api.getBlockInfo(hash))
          ).subscribe(
          data => this.onResult(data, searchType), this.caughtError
        );
        break;
      case 'tx':
        this.api.getTxInfo(sanitizedValue)
          .subscribe(data => this.onResult(data, searchType), this.caughtError);
        break;
      case 'address':
        this.api.getAddressUTXOs(sanitizedValue)
          .subscribe(data => {
              let coinAmount = 0;
              data.forEach(utxo => coinAmount += utxo.value);
              this.onResult({
                address: sanitizedValue,
                transactions: data,
                coinAmount: coinAmount
              }, searchType);
            },
            this.caughtError
          );
        break;
      default:
        console.error(`Unknown search type ${searchType}`);
    }
  }

}
