import { Component, OnDestroy, OnInit } from '@angular/core';
import { flatMap, take, publishReplay } from 'rxjs/operators';
import { ApiService, StateService } from '../../core/services';
import { Chart } from 'chart.js';
import { ChainTip, Block} from '../../core/models';


@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit, OnDestroy {
  private topBlock: string;
  private currentBlockIndex: number;
  private currentBlocks: Block[] = [];

  loading = true;
  displayedBlocks: Block[] = [];
  displayBlockNum = 20;
  intBlockNum = 200;

  chainTips: ChainTip[] = [];
  diff = 0;
  diff2 = 0;
  diffList = [];

  currentlyProcessedBlockHeight = - 1;
  currentlyProcessedBlockHeight2 = - 1;
  remaining = - 1;
  remaining2 = -1;
  labels = [];
  data = [];
  visited = false;
  visited1 = false;

  lineChart: Chart; //interval line graph
  chart2: Chart; //difficulty line graph
  chart3: Chart; //chain tips histogram
  chart4: Chart; //interval histogram

  labels2 = new Array(20);
  data2 = new Array (20);

  intervalBlocks: Block[] = [];
  currentBlocks2: Block[] = [];

  chainLabels = [];
  chainData = [];
  curTip = 0;

  numBuckets = 300;
  buckets = new Array(this.numBuckets); //number arrays
  intervalData = new Array(this.numBuckets);


  //bubble graph variables

  timelineData = new Array (20);
  timelineX = new Array (20);
  timelineY = 0;


  constructor(
    private state: StateService,
    private api: ApiService
  ) {
  }



  ngOnInit() { //charts inside this function will update in realtime (future data)
    this.getChainTips();

    const canvas4 = <HTMLCanvasElement>document.getElementById("intervalChart");
    var context4 = canvas4.getContext("2d");
    this.chart4 = new Chart(context4, {
      type: 'bar',
      data: {
        labels: this.buckets,
        datasets: [{
          label: "Interval Occurences",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBorderColor: "rgba(75,192,192,1)",
          pointHoverBackgroundColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.intervalData
        }]
      },
      options: {
        responsive: false,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Total blocks loaded'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time Interval (s)'
            }
          }]
        }
      }
    });

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
        this.diff = this.displayedBlocks[0].time - this.displayedBlocks[1].time;
        
        this.displayedBlocks[0].interval = this.diff;

        if(this.diff <= 10){
          this.diffList.unshift(this.displayedBlocks[0].height);
        }

        if(this.displayedBlocks.length >= 20){

          this.lineChart.destroy();
          this.chart2.destroy();

          var numBlocksOnRecord = this.displayedBlocks.length;
          for (var i = 0; i < this.displayBlockNum; i ++) {
            this.labels[i] = this.displayedBlocks[ numBlocksOnRecord - 1 - i].height;
            this.data[i] = this.displayedBlocks[numBlocksOnRecord - 1 - i].interval;
          }
          const canvas = <HTMLCanvasElement>document.getElementById("lineChart");
          var ctx = canvas.getContext("2d");
          this.lineChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: this.labels,
              datasets: [{
                label: "Block Creation Time Intervals",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBorderColor: "rgba(75,192,192,1)",
                pointHoverBackgroundColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.data
              }]
            },
            options: {
              responsive: false,
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Interval (s)'
                  }
                }],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Block Height'
                  }
                }]
              }
            }
          });


          for(var i = 0; i < 20; i ++) {
            this.labels2[i] =  this.labels[i];
            this.data2[i] = this.displayedBlocks[19-i].difficulty;
          }
          const canvas2 = <HTMLCanvasElement>document.getElementById("difficultyChart");
          var context2 = canvas2.getContext("2d");
          this.chart2 = new Chart(context2, {
            type: 'line',
            data: {
              labels: this.labels2,
              datasets: [{
                label: "Difficulty",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBorderColor: "rgba(75,192,192,1)",
                pointHoverBackgroundColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.data2
              }]
            },
            options: {
              responsive: false,
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Difficulty'
                  }
                }],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Block Height'
                  }
                }]
              }
            }
          });

          
        }

  

        this.chainLabels = new Array(50);
        this.chainData = new Array(50);

        for(var i = 0; i<50; i++){
          this.chainLabels[49-i] = this.chainTips[i+this.curTip].height;
          this.chainData[49-i] = this.chainTips[i+this.curTip].branchlen;
        }

        this.chart3.destroy();

        const canvas3 = <HTMLCanvasElement>document.getElementById("tipsChart");
        var context3 = canvas3.getContext("2d");
            this.chart3 = new Chart(context3, {
              type: 'bar',
              data: {
                labels: this.chainLabels,
                datasets: [{
                  label: "chainTips",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBorderColor: "rgba(75,192,192,1)",
                  pointHoverBackgroundColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.chainData
                }]
              },
              options: {
                responsive: false,
                scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Branch Length'
                    }
                  }],
                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Block Height'
                    }
                  }]
                }
              }
          });

      });
  }

  ngOnDestroy() {
    this.state.stopStateUpdate();
  }

  //get ChainTip objects into chainTips[]
  getChainTips(){
    this.api.getChainTips()
      .subscribe(data => {
        this.chainTips = data;
        console.log(this.chainTips);
      }
    );
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

  getMore() { //called when button is pushed to load the interval chart
    this.state.topBlockHash
      .pipe(
        take(1)
      )
      .subscribe((data: string) => {
        console.log(`Init explorer with block ${data}`); 
        this.topBlock = data;

        this.getMoreBlocks(this.topBlock)
          .then(_ => console.log('Blocks loaded'))
          .catch(err => console.error(err));
      });
  }


  get isMoreNext(): boolean {
    return this.currentBlockIndex > this.displayBlockNum;
  }

  get isMorePrev(): boolean {
    return this.currentBlocks[this.currentBlocks.length - 1].height > 0;
  }

  get isMoreNextTips(): boolean {
    var cTip = this.curTip - 50;
    for(var i = 0; i<50; i++){
      if(i+ cTip <  0) {
        return false;
      }
    }
    return true;
  }

  get isMorePrevTips(): boolean {

    var cTip = this.curTip + 50;
    for(var i = 0; i<50; i++){
      if(i+ cTip >= this.chainTips.length) {
        return false;
      }
    }
    return true;
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

    //update labels and data
    var numBlocksOnRecord = this.displayedBlocks.length;
    for (var i = 0; i < this.displayBlockNum; i ++) {
      this.labels[i] = this.displayedBlocks[ numBlocksOnRecord - 1 - i].height;
      this.data[i] = this.displayedBlocks[numBlocksOnRecord - 1 - i].interval;
    }
    
    for (var i = 0; i < 20; i ++) {
      this.labels2[i] =  this.labels[i];
      this.data2[i] = this.displayedBlocks[19-i].difficulty;
    }

    this.lineChart.update();
    this.chart2.update();
  }



  getNext() {
    if (!this.isMoreNext) {
      return;
    }

    this.currentBlockIndex -= this.displayBlockNum;
    this.displayedBlocks = this.currentBlocks.slice(this.currentBlockIndex - this.displayBlockNum, this.currentBlockIndex);
    var numBlocksOnRecord = this.displayedBlocks.length;
    for (var i = 0; i < this.displayBlockNum; i ++) {
      this.labels[i] = this.displayedBlocks[ numBlocksOnRecord - 1 - i].height;
      this.data[i] = this.displayedBlocks[numBlocksOnRecord - 1 - i].interval;
    }

    for (var i = 0; i < 20; i ++) {
      this.labels2[i] =  this.labels[i];
      this.data2[i] = this.displayedBlocks[19 - i].difficulty;
    }

    this.lineChart.update();
    this.chart2.update();
  }


  getPrevTips(){

    if (!this.isMorePrevTips) {
      return;
    }

    this.curTip +=50;
    for(var i = 0; i<50; i++){
      this.chainLabels[49-i] = this.chainTips[i+this.curTip].height;
      this.chainData[49-i] = this.chainTips[i+this.curTip].branchlen;
    }
    this.chart3.update();

  }

  getNextTips(){

    if (!this.isMoreNextTips) {
      return;
    }

    this.curTip -=50;
    for(var i = 0; i<50; i++){
      this.chainLabels[49-i] = this.chainTips[i+this.curTip].height;
      this.chainData[49-i] = this.chainTips[i+this.curTip].branchlen;
    }
    this.chart3.update();
    
  }


  getBlockHash(height: number) {
    const found = this.currentBlocks.find(block => block.height === height);
    if (!found) {
      console.error(`No block found for height ${height}`);
      return;
    }
    return found.hash;
  }

  private async getBlocks(blockHash: string, numBlocks: number = 20, wantToDownloadAll: boolean = false) { //charts will load with previous data
   
    if (numBlocks > 0 || wantToDownloadAll) {
      this.loading = true;
      this.api.getBlockInfo(blockHash).subscribe(block => {
        this.displayedBlocks.push(block);
        this.currentlyProcessedBlockHeight = block.height;
        this.remaining = numBlocks;
        if (this.displayedBlocks.length > this.displayBlockNum) {
          this.displayedBlocks.splice(0, 1);

        }
        this.currentBlocks.push(block);
        if (this.displayedBlocks.length > 1) {
          this.diff = this.currentBlocks[this.currentBlocks.length-2].time - this.currentBlocks[this.currentBlocks.length-1].time; //fill array in here
          
          if(this.diff <= 10){
            this.diffList.push(this.currentBlocks[this.currentBlocks.length-2].height);
          }
          this.currentBlocks[this.currentBlocks.length-2].interval = this.diff;

        }

        if(numBlocks <= 1){
          this.displayBlockNum = this.displayedBlocks.length;
          console.log ( "DEBUG: Got to here, data length is: " + JSON.stringify(this.displayedBlocks.length) + " and the expected number of blocks is: " + this.displayBlockNum);
          var numBlocksOnRecord = this.displayedBlocks.length;
          for (var i = 0; i < this.displayBlockNum; i ++) {
            this.labels[i] = this.displayedBlocks[ numBlocksOnRecord - 1 - i].height;
            this.data[i] = this.displayedBlocks[numBlocksOnRecord - 1 - i].interval;
          }
            console.log ("DEBUG: are labels as expected? " + JSON.stringify(this.data) + JSON.stringify(this.labels));
            
            if(this.visited === true){
              this.lineChart.destroy();
              this.chart2.destroy();
            }

            this.visited = true; //visited means the chart has been created... used to prevent destroying the charts before it has been created

            const canvas = <HTMLCanvasElement>document.getElementById("lineChart");
            var ctx = canvas.getContext("2d");
            this.lineChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: this.labels,
                datasets: [{
                  label: "Block Creation Time Intervals",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBorderColor: "rgba(75,192,192,1)",
                  pointHoverBackgroundColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.data
                }]
              },
              options: {
                responsive: false,
                scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Interval (s)'
                    }
                  }],
                  xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Block Height'
                  }
                }]
                }
              }
            });


            
            for (var i = 0; i < 20; i ++) {
              this.labels2[i] =  this.labels[i];
              this.data2[i] = this.displayedBlocks[19-i].difficulty;
            }


            const canvas2 = <HTMLCanvasElement>document.getElementById("difficultyChart");
            var context2 = canvas2.getContext("2d");
            this.chart2 = new Chart(context2, {
              type: 'line',
              data: {
                labels: this.labels2,
                datasets: [{
                  label: "Difficulty",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBorderColor: "rgba(75,192,192,1)",
                  pointHoverBackgroundColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.data2
                }]
              },
              options: {
                responsive: false,
                scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Difficulty'
                    }
                  }],
                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Block Height'
                    }
                  }]
                }
              }
            });


        this.getChainTips();

        this.chainLabels = new Array(50);
        this.chainData = new Array(50);

        for(var i = 0; i<50; i++){
          this.chainLabels[49-i] = this.chainTips[i+this.curTip].height;
          this.chainData[49-i] = this.chainTips[i+this.curTip].branchlen;
        }

        const canvas3 = <HTMLCanvasElement>document.getElementById("tipsChart");
            var context3 = canvas3.getContext("2d");
            this.chart3 = new Chart(context3, {
              type: 'bar',
              data: {
                labels: this.chainLabels,
                datasets: [{
                  label: "chainTips",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(75,192,192,0.4)",
                  borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBorderColor: "rgba(75,192,192,1)",
                  pointHoverBackgroundColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: this.chainData
                }]
              },
              options: {
                responsive: false,
                  scales: {
                  yAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Branch Length'
                    }
                  }],
                  xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Block Height'
                    }
                  }]
                }
              }
            });
          
        }

        if (!!block.previousblockhash || (block.height === 0)) {
          this.getBlocks(block.previousblockhash, numBlocks - 1, wantToDownloadAll)
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




  private async getMoreBlocks(blockHash: string, numBlocks: number = 200) {
   
    if (numBlocks > 0 ) {
      this.loading = true;
      this.api.getBlockInfo(blockHash).subscribe(block => {
        this.intervalBlocks.push(block);
        this.currentlyProcessedBlockHeight2 = block.height;
        this.remaining2 = numBlocks;
        if (this.intervalBlocks.length > this.intBlockNum) {
          this.intervalBlocks.splice(0, 1);

        }
        this.currentBlocks2.push(block);
        if (this.intervalBlocks.length > 1) {
          this.diff2 = this.currentBlocks2[this.currentBlocks2.length-2].time - this.currentBlocks2[this.currentBlocks2.length-1].time; //fill array in here

          this.currentBlocks2[this.currentBlocks2.length-2].interval = this.diff2;

        }
        if(numBlocks <= 1){
          this.intBlockNum = this.intervalBlocks.length;
          console.log ( "DEBUG: Got to here, data length is: " + JSON.stringify(this.intervalBlocks.length) + " and the expected number of blocks is: " + this.intBlockNum);
          var numBlocksOnRecord = this.intervalBlocks.length;
  

          //initialize buckets and data array
          if(this.visited1 === false){
            for (var i = 0; i < this.numBuckets; i ++) {
              this.buckets[i] = [i + 1];
              this.intervalData[i] = 0;
            }
          }

          //prepare data for interval histogram
          var numExtremelylong = 0;
          for (var i = 0; i < this.intBlockNum; i ++) {
            var currentInterval = this.intervalBlocks[i].interval;
            if (currentInterval >= this.numBuckets) {
              numExtremelylong ++;
              console.log("So far, found " +numExtremelylong +" extremely long intervals. This should'nt happen (?)");
              continue;
            } 
            this.intervalData[currentInterval] ++;
          }

          // destroy chart to fix hovering issue
          if(this.visited1 === true){
              this.chart4.destroy();
          }
          this.visited1 = true;

          //
          var total = 0;

          for (var i = 0; i < this.numBuckets; i ++) {
            total+= this.intervalData[i];
          }

          console.log("TOTAL " + total);

          const canvas4 = <HTMLCanvasElement>document.getElementById("intervalChart");
          var context4 = canvas4.getContext("2d");
          this.chart4 = new Chart(context4, {
            type: 'bar',
            data: {
              labels: this.buckets,
              datasets: [{
                label: "Interval Occurences",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBorderColor: "rgba(75,192,192,1)",
                pointHoverBackgroundColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.intervalData
              }]
            },
            options: {
              responsive: false,
              scales: {
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Total blocks loaded'
                  }
                }],
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Time Interval (s)'
                  }
                }]
              }
            }
          });
          
        }

        if (!!block.previousblockhash || (block.height === 0)) {
          this.getMoreBlocks(block.previousblockhash, numBlocks - 1)
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
