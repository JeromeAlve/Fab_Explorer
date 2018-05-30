import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {BlockInfo, Tx} from './models/blockinfo';

import {ChainInfo} from './models/chainInfo';
import {DataService} from './services/data.service';
import {BlockInfoComponent} from './components/block-info/block-info.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {delay} from 'q';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  myBlockInfo: BlockInfo; // Always the latest block
  myTransactionInfo: Tx;
  currentBlock: BlockInfo;
  previousBlock: BlockInfo;
  nextBlock: BlockInfo;

  myChainInfo: ChainInfo;
  tmpBlock: BlockInfo;

  isBlockTableActive = true;
  isBlockViewActive = false;
  isChainInfoActive = false;
  isBiActive = false;
  isTiActive = false;

  disableForwardButton = true;
  disableBackwardButton = false;

  // For Display purposes
  // At any given time, five blocks will be displayed
  curFiveBlocks: BlockInfo[] = []; // For Dispaly Purposes

  // configURL: string = 'http://35.182.160.212:18667/rest/'; //TestNet
  configURL = 'http://18.130.8.117:8667/rest/'; // mainnet


  // date = new Date(unix_timestamp*1000);

  constructor(private dataService: DataService, private http: HttpClient) {
  }

  ngOnInit() {

    this.dataService.getChainInfo().subscribe(async myChainInfo => {
      await (this.myChainInfo = myChainInfo);
      await this.setCurrentBlock(this.myChainInfo.bestblockhash);
      await this.setCurFiveBlocks();
    });


    setInterval(() => {

      this.dataService.getChainInfo().subscribe(chain => {

        if (this.myChainInfo.bestblockhash === (<ChainInfo>(chain)).bestblockhash) {
          console.log('No new block');
        }
        else {
          console.log('new block added to the chain');
          delay(1000);
          this.dataService.getChainInfo().subscribe(async myChainInfo => {
            this.myChainInfo = myChainInfo;
            await this.setCurrentBlock(this.myChainInfo.bestblockhash);

            // this function should be called only when user requests for the latest blocks
            // await this.setCurFiveBlocks();
          });

        }

      });
    }, 10000);

  }


  setCurrentBlock(bId: string) {

    this.dataService.getBlockInfo(bId).subscribe(async myBlockInfo => {
      await (this.myBlockInfo = myBlockInfo);
      this.myBlockInfo.date = new Date(this.myBlockInfo.time * 1000);

      //this may not be needed
      /*
      await(this.currentBlock = myBlockInfo)
      this.currentBlock.date = new Date(this.myBlockInfo.time * 1000)
      */
    });

  }


  setTransactionInfo(tId: string) {

    this.myTransactionInfo = null;

    this.dataService.getTxInfo(tId).subscribe(data => {

      this.myTransactionInfo = data;

    });

  }

  TxFromBlockClicked(tId: string) {

    this.setTransactionInfo(tId);

    this.isChainInfoActive = false;
    this.isBlockTableActive = false;
    this.isBiActive = false;
    this.isTiActive = true;
    this.isBlockViewActive = false;

  }

  blockClicked(bHeight: number) {


    for (var i = 0; i < this.curFiveBlocks.length; i++) {
      if (this.curFiveBlocks[i].height === bHeight) {

        this.currentBlock = this.curFiveBlocks[i];

        this.dataService.getBlockInfo(this.currentBlock.previousblockhash).subscribe(
          data => {
            this.previousBlock = data;
            this.previousBlock.date = new Date(this.previousBlock.time * 1000);
          });

        if (this.currentBlock.nextblockhash) {
          this.dataService.getBlockInfo(this.currentBlock.nextblockhash).subscribe(
            data => {
              this.nextBlock = data;
              this.nextBlock.date = new Date(this.nextBlock.time * 1000);
            });
        }
        else {
          this.nextBlock = undefined;
        }

        //Transactions are read into the block
        /* var k = this.currentBlock.tx.length

         for(var l = 0; l < k; l++)
         {
           console.log(this.currentBlock.tx[l].txid)
         }*/

        break;
      }
    }


    this.isChainInfoActive = false;
    this.isBlockTableActive = false;
    this.isBiActive = false;
    this.isTiActive = false;
    this.isBlockViewActive = true;


  }


  blockHashClicked(bHash: string) {


    this.dataService.getBlockInfo(bHash).subscribe(async data => {
      await (this.currentBlock = data);
      await (this.currentBlock.date = new Date(this.currentBlock.time * 1000));
      await (this.dataService.getBlockInfo(this.currentBlock.previousblockhash).subscribe(
        data => {
          this.previousBlock = data;
          this.previousBlock.date = new Date(this.previousBlock.time * 1000);
        }));

      if (this.currentBlock.nextblockhash) {
        this.dataService.getBlockInfo(this.currentBlock.nextblockhash).subscribe(
          data => {
            this.nextBlock = data;
            this.nextBlock.date = new Date(this.nextBlock.time * 1000);
          });
      }
      else {
        this.nextBlock = null;
      }
    });


    this.isBlockTableActive = false;
    this.isChainInfoActive = false;
    this.isBiActive = false;
    this.isTiActive = false;
    this.isBlockViewActive = true;


  }


  latestBlocksClicked() {

    this.disableForwardButton = true;

    this.setCurFiveBlocks();

    this.isBlockTableActive = true;
    this.isBlockViewActive = false;
    this.isChainInfoActive = false;
    this.isBiActive = false;
    this.isTiActive = false;

    let elem: HTMLElement = document.getElementById('tgl') as HTMLElement;
    elem.click();


  }

  chainInfoClicked() {

    this.dataService.getChainInfo().subscribe(myChainInfo => {
      this.myChainInfo = myChainInfo;
    });

    this.isChainInfoActive = true;
    this.isBlockTableActive = false;
    this.isBlockViewActive = false;
    this.isBiActive = false;
    this.isTiActive = false;


    let elem: HTMLElement = document.getElementById('tgl') as HTMLElement;
    elem.click();
  }


  searchBlockClicked() {


    //  this.myBlockInfo = null;
    //  this.currentBlock = null;

    this.isBiActive = true;
    this.isBlockTableActive = false;
    this.isBlockViewActive = false;
    this.isTiActive = false;
    this.isChainInfoActive = false;

    let elem: HTMLElement = document.getElementById('tgl') as HTMLElement;
    elem.click();
  }

  searchTransactionClicked() {

    this.myTransactionInfo = null;

    this.isBiActive = false;
    this.isBlockTableActive = false;
    this.isBlockViewActive = false;
    this.isTiActive = true;
    this.isChainInfoActive = false;


    let elem: HTMLElement = document.getElementById('tgl') as HTMLElement;
    elem.click();
  }

  searchBlockById(bId: string) {

    this.dataService.getBlockInfo(bId).subscribe(data => {
      this.currentBlock = data;
      this.isBlockViewActive = true;


      this.dataService.getBlockInfo(this.currentBlock.previousblockhash).subscribe(
        data => {
          this.previousBlock = data;
          this.previousBlock.date = new Date(this.previousBlock.time * 1000);
        });

      this.dataService.getBlockInfo(this.currentBlock.nextblockhash).subscribe(data => {
        this.nextBlock = data;
        this.nextBlock.date = new Date(this.currentBlock.time * 1000);
      });


      console.log(data);

    });

  }


  previousBlockClicked() {

    this.isBlockTableActive = false;
    this.isBlockViewActive = true;

    this.nextBlock = this.currentBlock;
    this.currentBlock = this.previousBlock;
    this.dataService.getBlockInfo(this.currentBlock.previousblockhash).subscribe(
      data => {
        this.previousBlock = data;
        this.previousBlock.date = new Date(this.previousBlock.time * 1000);
      });


  }


  nextBlockClicked() {


    this.isBlockTableActive = false;
    this.isBlockViewActive = true;
    this.isChainInfoActive = false;

    this.previousBlock = this.currentBlock;

    this.dataService.getBlockInfo(this.currentBlock.nextblockhash).subscribe(async data => {

      await (this.currentBlock = data);
      await (this.currentBlock.date = new Date(this.currentBlock.time * 1000));


      if (this.currentBlock.nextblockhash) {
        this.dataService.getBlockInfo(this.currentBlock.nextblockhash).subscribe(data => {
          this.nextBlock = data;
          this.nextBlock.date = new Date(this.currentBlock.time * 1000);
        });
      } else {
        this.nextBlock = undefined;
      }

    });
  }
  // change this function to add argument of starting block hash
  async setCurFiveBlocks() {
    this.curFiveBlocks = [];

    this.http.get(this.configURL + 'block/' + this.myChainInfo.bestblockhash + '.json').subscribe(
      async data => {
        (this.tmpBlock = <BlockInfo>data);
        this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
        this.curFiveBlocks.push(<BlockInfo>data);

        await (this.http.get(this.configURL + 'block/' + this.tmpBlock.previousblockhash + '.json').subscribe(
          async data => {
            (this.tmpBlock = <BlockInfo>data);
            this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
            this.curFiveBlocks.push(<BlockInfo>data);


            await (this.http.get(this.configURL + 'block/' + this.tmpBlock.previousblockhash + '.json').subscribe(
              async data => {
                (this.tmpBlock = <BlockInfo>data);
                this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
                this.curFiveBlocks.push(<BlockInfo>data);

                await (this.http.get(this.configURL + 'block/' + this.tmpBlock.previousblockhash + '.json').subscribe(
                  async data => {
                    (this.tmpBlock = <BlockInfo>data);
                    this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
                    this.curFiveBlocks.push(<BlockInfo>data);


                    await (this.http.get(this.configURL + 'block/' + this.tmpBlock.previousblockhash + '.json').subscribe(
                      async data => {
                        (this.tmpBlock = <BlockInfo>data);
                        this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
                        this.curFiveBlocks.push(<BlockInfo>data);

                      }));
                  }));
              }));
          }));
      });
  }


  backButtonClicked() {
    this.disableForwardButton = false;

    if (this.curFiveBlocks[this.curFiveBlocks.length - 1].height < 6) {
      this.disableBackwardButton = true;
    }

    const tmpHash = this.curFiveBlocks[this.curFiveBlocks.length - 1].previousblockhash;

    this.curFiveBlocks = [];

    this.http.get(this.configURL + 'block/' + tmpHash + '.json').subscribe(
      async data => {
        (this.tmpBlock = <BlockInfo>data);
        this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
        this.curFiveBlocks.push(<BlockInfo>data);

        await (this.http.get(this.configURL + 'block/' + this.tmpBlock.previousblockhash + '.json').subscribe(
          async data => {
            (this.tmpBlock = <BlockInfo>data);
            this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
            this.curFiveBlocks.push(<BlockInfo>data);


            await (this.http.get(this.configURL + 'block/' + this.tmpBlock.previousblockhash + '.json').subscribe(
              async data => {
                (this.tmpBlock = <BlockInfo>data);
                this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
                this.curFiveBlocks.push(<BlockInfo>data);

                await (this.http.get(this.configURL + 'block/' + this.tmpBlock.previousblockhash + '.json').subscribe(
                  async data => {
                    (this.tmpBlock = <BlockInfo>data);
                    this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
                    this.curFiveBlocks.push(<BlockInfo>data);


                    await (this.http.get(this.configURL + 'block/' + this.tmpBlock.previousblockhash + '.json').subscribe(
                      async data => {
                        (this.tmpBlock = <BlockInfo>data);
                        this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
                        this.curFiveBlocks.push(<BlockInfo>data);

                      }));
                  }));
              }));
          }));
      });


    this.isBlockTableActive = true;
    // include logic here to enable or disable the backward button
  }


  async forwardButtonClicked() {

    this.disableBackwardButton = false;

    const tmpHash = this.curFiveBlocks[0].nextblockhash;


    // Five blocks must be visible at all times
    // include logic here to enable or disable forward button


    // Myblockinfo is always the latest block

    let curHeight;
    const maxHeight = this.myBlockInfo.height;


    await (this.dataService.getBlockInfo(tmpHash).subscribe(async data => {

      await (this.tmpBlock = data);
      await (curHeight = this.tmpBlock.height);

      if (maxHeight - curHeight < 7) {
        // disable the forward button
        this.disableForwardButton = true;

        // set the latest five blocks
        this.setCurFiveBlocks();
      }
      else {
        this.curFiveBlocks = [];

        this.http.get(this.configURL + 'block/' + tmpHash + '.json').subscribe(
          async data => {
            (this.tmpBlock = <BlockInfo>data);
            this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
            this.curFiveBlocks.push(<BlockInfo>data);

            await (this.http.get(this.configURL + 'block/' + this.tmpBlock.nextblockhash + '.json').subscribe(
              async data => {
                (this.tmpBlock = <BlockInfo>data);
                this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
                this.curFiveBlocks.unshift(<BlockInfo>data);


                await (this.http.get(this.configURL + 'block/' + this.tmpBlock.nextblockhash + '.json').subscribe(
                  async data => {
                    (this.tmpBlock = <BlockInfo>data);
                    this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
                    this.curFiveBlocks.unshift(<BlockInfo>data);

                    await (this.http.get(this.configURL + 'block/' + this.tmpBlock.nextblockhash + '.json').subscribe(
                      async data => {
                        (this.tmpBlock = <BlockInfo>data);
                        this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
                        this.curFiveBlocks.unshift(<BlockInfo>data);


                        await (this.http.get(this.configURL + 'block/' + this.tmpBlock.nextblockhash + '.json').subscribe(
                          async data => {
                            (this.tmpBlock = <BlockInfo>data);
                            this.tmpBlock.date = new Date(this.tmpBlock.time * 1000);
                            this.curFiveBlocks.unshift(<BlockInfo>data);

                          }));
                      }));
                  }));
              }));
          });

      }
    }));

    this.isBlockTableActive = true;

  }


}




