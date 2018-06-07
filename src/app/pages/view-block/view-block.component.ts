import { Component, OnInit } from '@angular/core';
import {Block} from '../../core/models';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-view-block',
  templateUrl: './view-block.component.html',
  styleUrls: ['./view-block.component.css']
})
export class ViewBlockComponent implements OnInit {
  block: Block;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: {block: Block}) => {
      this.block = data.block;
    });
  }

}
