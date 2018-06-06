import {Component, OnInit} from '@angular/core';
import {Block, Tx} from '../../core/models';
import {ApiService} from '../../core/services';
import {toInteger} from '@ng-bootstrap/ng-bootstrap/util/util';
import {flatMap} from 'rxjs/operators';
import {AddressInfo} from '../../core/models/address.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchType = 'blockHash';
  searchValue = '';
  searching = false;

  searchOptions = [{
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

  currentBlock: Block;
  currentTransaction: Tx;
  currentAddressInfo: AddressInfo;

  constructor(
    private api: ApiService
  ) {
  }

  ngOnInit() {
  }

  search() {
    switch (this.searchType) {
      case 'blockHeight':
        this.api.getBlockHash(toInteger(this.searchValue))
          .pipe(
            flatMap(hash => {
              return this.api.getBlockInfo(hash);
            })
          ).subscribe(
          block => this.currentBlock = block
        );
        break;
      case 'blockHash':
        this.api.getBlockInfo(this.searchValue).subscribe(data => this.currentBlock = data);
        break;
      case 'txHash':
        this.api.getTxInfo(this.searchValue).subscribe(data => this.currentTransaction = data);
        break;
      case 'address':
        this.api.getAddressUTXOs(this.searchValue)
          .subscribe(data => {
              let coinAmount = 0;
              data.forEach(utxo => coinAmount += utxo.value);

              this.currentAddressInfo = {
                address: this.searchValue,
                transactions: data,
                coinAmount: coinAmount
              };
            }
          );
        break;
      default:
        console.error(`Unknown search type ${this.searchType}`);
    }
  }
}
