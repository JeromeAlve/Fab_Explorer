import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../core/services';
import {Chain} from '../../core/models';

@Component({
  selector: 'app-chain-info',
  templateUrl: './chain-info.component.html',
  styleUrls: ['./chain-info.component.css']
})
export class ChainInfoComponent implements OnInit {

  chainInfo: Chain;

  constructor(
    private api: ApiService
  ) {
  }

  ngOnInit() {
    this.api.getChainInfo().subscribe((result) => {
      this.chainInfo = result;
    });
  }

}
