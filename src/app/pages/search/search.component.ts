import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { flatMap } from 'rxjs/operators';
import { Block, Tx } from '../../core/models';
import { AddressInfo } from '../../core/models/address.model';
import { ApiService } from '../../core/services';
import { UtilsService } from '../../core/services/utils.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResult: Block | Tx | AddressInfo;
  resultType: string;
  searchFailed = false;
  searchError: string;
  searchValue = '';

  constructor(
    private api: ApiService,
    private utils: UtilsService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => this.search(params.searchValue)
    );
  }

  onResult = (res, type) => {
    this.searchResult = res;
    this.resultType = type;
    this.searchFailed = false;
    this.spinner.hide();
  }

  private onError = (err, searchValue) => {
    this._caughtError(`Failed to find ${searchValue}`);
    this.spinner.hide();
  }

  private searchTypeError(searchValue) {
    this._caughtError(`Invalid search value ${searchValue}`);
  }

  private _caughtError(err) {
    console.error(err);
    this.searchFailed = true;
    this.searchError = err;
    this.resultType = null;
  }

  search(searchValue) {
    let searchType: string;
    const sanitizedValue = searchValue.replace(/[^\w]/g, '');
    this.searchValue = sanitizedValue;

    if (sanitizedValue === '') {
      this.searchTypeError(searchValue);
      return;
    }

    if (!isNaN(Number(sanitizedValue))) {
      searchType = 'block';
    } else {
      searchType = UtilsService.checkHashType(sanitizedValue);
      if (!searchType) {
        this.searchTypeError(searchValue);
        return;
      }
    }

    this.spinner.show();
    switch (searchType) {
      case 'block':
        this.api.getBlockHash(Number(sanitizedValue))
          .pipe(
            flatMap(hash => this.api.getBlockInfo(hash))
          ).subscribe(
          data => this.onResult(data, searchType),
          err => this.onError(err, searchValue)
        );
        break;
      case 'tx/block':
        this.api.getTxInfo(sanitizedValue)
          .subscribe(
            data => this.onResult(data, 'tx'),
            _ => this.api.getBlockInfo(sanitizedValue)
              .subscribe(
                data => this.onResult(data, 'block'),
                err => this.onError(err, searchValue)
              )
          );
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
            err => this.onError(err, searchValue)
          );
        break;
      default:
        console.error(`Unknown search type ${searchType}`);
    }
  }
}
