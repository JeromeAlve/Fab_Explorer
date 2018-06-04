import {Component, OnInit} from '@angular/core';
import {ApiService, StateService} from '../../core/services';
import {Block} from '../../core/models';

@Component({
  selector: 'app-latest-blocks',
  templateUrl: './latest-blocks.component.html',
  styleUrls: ['./latest-blocks.component.css']
})
export class LatestBlocksComponent implements OnInit {
  private topBlock: string;
  private currentBlockIndex: number;
  private currentBlocks: Block[] = [];

  initialized = false;
  loading = true;
  moreNext = false;
  morePrev = true;
  displayedBlocks: Block[] = [];
  displayBlockNum = 5;

  constructor(
    private state: StateService,
    private api: ApiService
  ) {
  }

  ngOnInit() {
    const latestBlock = this.state.topBlockHash.getValue();
    if (!!latestBlock) {
      this.initBlock(latestBlock);
    }

    this.state.getLatestBlockHash()
      .subscribe(data => {
        if (!this.initialized && data != null) {
          this.initBlock(data);
        }
      });
  }

  initBlock(blockHash: string) {
    this.topBlock = blockHash;
    this.getBlocks(this.topBlock);
    this.currentBlockIndex = this.displayBlockNum;
    this.initialized = true;
  }

  getPrev() {
    const blockLen = this.currentBlocks.length;

    if (this.currentBlocks[blockLen - 1].height === 0) {
      this.morePrev = false;
      return;
    }

    if (this.currentBlockIndex === blockLen) {
      this.displayedBlocks = [];
      this.getBlocks(this.currentBlocks[blockLen - 1].previousblockhash, this.displayBlockNum);
    } else {
      this.displayedBlocks = this.currentBlocks.slice(this.currentBlockIndex, this.currentBlockIndex + this.displayBlockNum);
    }

    this.currentBlockIndex += this.displayBlockNum;
    this.moreNext = true;
  }

  getNext() {
    if (this.currentBlockIndex - this.displayBlockNum <= 0) {
      this.moreNext = false;
      return;
    }
    this.currentBlockIndex -= this.displayBlockNum;
    this.displayedBlocks = this.currentBlocks.slice(this.currentBlockIndex - this.displayBlockNum, this.currentBlockIndex);
    this.morePrev = true;
  }

  private getBlocks(blockHash: string, numBlocks: number = 5) {
    if (numBlocks > 0) {
      this.loading = true;
      this.api.getBlockInfo(blockHash).subscribe(block => {
        this.displayedBlocks.push(block);
        this.currentBlocks.push(block);

        if (!!block.previousblockhash) {
          this.getBlocks(block.previousblockhash, numBlocks - 1);
        }
      });
    } else {
      this.loading = false;
    }
  }

}
