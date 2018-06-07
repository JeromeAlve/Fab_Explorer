import {Component, Input, OnInit} from '@angular/core';
import {Block} from '../../core/models';

@Component({
  selector: 'app-block-info',
  templateUrl: './block-info.component.html',
  styleUrls: ['./block-info.component.css']
})
export class BlockInfoComponent implements OnInit {
  @Input() block: Block;

  constructor() { }

  ngOnInit() {
    this.block.date = new Date(this.block.time * 1000);
  }

  getBlockHash() {

  }

}
