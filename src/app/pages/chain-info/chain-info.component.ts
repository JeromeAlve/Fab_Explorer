import { Component, OnDestroy, OnInit } from '@angular/core';
import { StateService } from '../../core/services';
import { Chain } from '../../core/models';

@Component({
  selector: 'app-chain-info',
  templateUrl: './chain-info.component.html',
  styleUrls: ['./chain-info.component.css']
})
export class ChainInfoComponent implements OnInit, OnDestroy {

  chainInfo: Chain;

  constructor(
    private state: StateService
  ) {
  }

  ngOnInit() {
    this.state.currentChain.subscribe(data => this.chainInfo = data);
    this.state.startStateUpdate();
  }

  ngOnDestroy() {
    this.state.stopStateUpdate();
  }

}
