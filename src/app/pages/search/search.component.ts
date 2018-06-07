import {Component, OnInit} from '@angular/core';
import {Block, Tx} from '../../core/models';
import {AddressInfo} from '../../core/models/address.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResult: Block | Tx | AddressInfo;
  resultType: string;

  constructor() {
  }

  ngOnInit() {
  }

  onResult(result: { data: Block | Tx | AddressInfo, type: string }) {
    if (!!result) {
      this.searchResult = result.data;
      this.resultType = result.type;
    } else {
      this.searchResult = null;
      this.resultType = null;
    }
  }
}
