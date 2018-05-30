import {Component} from '@angular/core';
import {DataService} from '../../services/data.service';
import {BlockInfo} from '../../models/blockinfo';


@Component({
  selector: 'app-block-info',
  templateUrl: './block-info.component.html',
  styleUrls: ['./block-info.component.css']
})
export class BlockInfoComponent {

  myBlockInfo: BlockInfo;
  curFiveBlocks: BlockInfo[] = [];

  constructor(private dataService: DataService) {
  }

  setCurrentBlock(bId: string) {

    this.dataService.getBlockInfo(bId).subscribe(myBlockInfo => {
      this.myBlockInfo = myBlockInfo;
    });


  }

}
