import {Component, OnInit} from '@angular/core';
import {ApiService, StateService} from '../../core/services';
import {Chain} from '../../core/models';

@Component({
  selector: 'app-chain-info',
  templateUrl: './chain-info.component.html',
  styleUrls: ['./chain-info.component.css']
})
export class ChainInfoComponent implements OnInit {

  chainInfo: Chain;

  constructor(
    private state: StateService
  ) {
  }

  ngOnInit() {
    const latestChain = this.state.currentChain.getValue();
    if (!!latestChain) {
      this.chainInfo = latestChain;
    }
    this.state.getChainInfo().subscribe(data => {
      this.chainInfo = data;
    });
  }

}
