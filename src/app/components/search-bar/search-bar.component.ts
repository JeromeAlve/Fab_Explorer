import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchOption} from '../../core/models/search-options.model';
import {toInteger} from '@ng-bootstrap/ng-bootstrap/util/util';
import {ApiService} from '../../core/services';
import {NgxSpinnerService} from 'ngx-spinner';
import {flatMap} from 'rxjs/operators';
import {Block, Tx} from '../../core/models';
import {AddressInfo} from '../../core/models/address.model';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Output() searchResult = new EventEmitter<{ data: Block | Tx | AddressInfo, type: string }>();
  searchFailed = false;
  displaySearchValue: string;

  searchType: SearchOption;
  searchValue = '';
  searchOptions: SearchOption[] = [{
    name: 'Block Hash',
    value: 'blockHash'
  }, {
    name: 'Block Height',
    value: 'blockHeight'
  }, {
    name: 'Transaction Hash',
    value: 'txHash'
  }, {
    name: 'Address',
    value: 'address'
  }];

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.searchType = this.searchOptions[0];
  }

  private caughtError = (err) => {
    console.error(err);
    this.searchFailed = true;
    this.displaySearchValue = this.searchValue;
    this.searchResult.emit(null);
    this.spinner.hide();
  };

  setSearchType(option: SearchOption) {
    this.searchType = option;
    this.searchFailed = false;
  }

  onKey(event: any) {
    if (event.keyCode === 13) {
      this.search();
    } else {
      this.searchValue = event.target.value;
    }
  }

  search() {
    this.spinner.show();
    switch (this.searchType.value) {
      case 'blockHeight':
        this.api.getBlockHash(toInteger(this.searchValue))
          .pipe(
            flatMap(hash => {
              return this.api.getBlockInfo(hash);
            })
          ).subscribe(
          data => {
            this.searchResult.emit({data: data, type: 'block'});
            this.searchFailed = false;
            this.spinner.hide();
          },
          this.caughtError
        );
        break;
      case 'blockHash':
        this.api.getBlockInfo(this.searchValue)
          .subscribe(data => {
            this.searchResult.emit({data: data, type: 'block'});
            this.searchFailed = false;
            this.spinner.hide();
          }, this.caughtError);
        break;
      case 'txHash':
        this.api.getTxInfo(this.searchValue).subscribe(data => {
          this.searchResult.emit({data: data, type: 'tx'});
          this.searchFailed = false;
          this.spinner.hide();
        }, this.caughtError);
        break;
      case 'address':
        this.api.getAddressUTXOs(this.searchValue)
          .subscribe(data => {
              let coinAmount = 0;
              data.forEach(utxo => coinAmount += utxo.value);
              this.searchResult.emit({
                data: {
                  address: this.searchValue,
                  transactions: data,
                  coinAmount: coinAmount
                },
                type: 'addressInfo'
              });
              this.searchFailed = false;
              this.spinner.hide();
            },
            this.caughtError
          );
        break;
      default:
        console.error(`Unknown search type ${this.searchType}`);
    }
  }

}
