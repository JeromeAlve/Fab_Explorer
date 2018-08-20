import { Component, OnDestroy, OnInit } from '@angular/core';
import { flatMap, take } from 'rxjs/operators';
import { ApiService, StateService } from '../../core/services';
import { Block } from '../../core/models';

@Component({
  selector: 'app-latest-blocks',
  templateUrl: './latest-blocks.component.html',
  styleUrls: ['./latest-blocks.component.css']
})
export class LatestBlocksComponent implements OnInit, OnDestroy {
  private topBlock: string;
  private currentBlockIndex: number;
  private currentBlocks: Block[] = [];

  loading = true;
  displayedBlocks: Block[] = [];
  displayBlockNum = 6;

  constructor(
    private state: StateService,
    private api: ApiService
  ) {
  }

  ngOnInit() {
    this.initBlock();
    this.state.startStateUpdate();
    this.state.topBlockHash
      .pipe(
        flatMap(data => this.api.getBlockInfo(data))
      )
      .subscribe(data => {
        if (this.currentBlocks.length > 0 && this.currentBlocks[0].height >= data.height) {
          return;
        }

        this.currentBlocks.unshift(data);
        this.displayedBlocks = this.currentBlocks.slice(this.currentBlockIndex - this.displayBlockNum, this.currentBlockIndex);
      });
  }

  ngOnDestroy() {
    this.state.stopStateUpdate();
  }

  initBlock() {
    this.state.topBlockHash
      .pipe(
        take(1)
      )
      .subscribe((data: string) => {
        console.log(`Init explorer with block ${data}`);
        this.topBlock = data;
        this.getBlocks(this.topBlock)
          .then(_ => console.log('Blocks loaded'))
          .catch(err => console.error(err));

        this.currentBlockIndex = this.displayBlockNum;
      });
  }

  get isMoreNext(): boolean {
    return this.currentBlockIndex > this.displayBlockNum;
  }

  get isMorePrev(): boolean {
    return this.currentBlocks[this.currentBlocks.length - 1].height > 0;
  }

  getPrev() {
    const blockLen = this.currentBlocks.length;

    if (!this.isMorePrev) {
      return;
    }

    this.currentBlockIndex += this.displayBlockNum;
    const displayDelta = this.currentBlockIndex - blockLen;

    if (displayDelta <= this.displayBlockNum && displayDelta > 0) {
      const prevBlockHash = this.currentBlocks[blockLen - 1].previousblockhash;
      this.getBlocks(prevBlockHash, displayDelta).catch(err => console.error(err));
    } else {
      this.displayedBlocks = this.currentBlocks.slice(this.currentBlockIndex - this.displayBlockNum, this.currentBlockIndex);
    }
  }

  getNext() {
    if (!this.isMoreNext) {
      return;
    }

    this.currentBlockIndex -= this.displayBlockNum;
    this.displayedBlocks = this.currentBlocks.slice(this.currentBlockIndex - this.displayBlockNum, this.currentBlockIndex);
  }

  getBlockHash(height: number) {
    const found = this.currentBlocks.find(block => block.height === height);
    if (!found) {
      console.error(`No block found for height ${height}`);
      return;
    }

    return found.hash;
  }

  private async getBlocks(blockHash: string, numBlocks: number = 6) {
    if (numBlocks > 0) {
      this.loading = true;
      this.api.getBlockInfo(blockHash).subscribe(block => {
        this.displayedBlocks.push(block);
        if (this.displayedBlocks.length > this.displayBlockNum) {
          this.displayedBlocks.splice(0, 1);
        }
        this.currentBlocks.push(block);

        if (!!block.previousblockhash) {
          this.getBlocks(block.previousblockhash, numBlocks - 1)
            .catch(err => {
              console.error(err);
              this.loading = false;
            });
        }
      });
    } else {
      this.loading = false;
    }
  }
}
