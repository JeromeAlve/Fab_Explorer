import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../core/services';

@Component({
  selector: 'app-latest-blocks',
  templateUrl: './latest-blocks.component.html',
  styleUrls: ['./latest-blocks.component.css']
})
export class LatestBlocksComponent implements OnInit {

  constructor(private api: ApiService) {
  }

  ngOnInit() {
  }

}
