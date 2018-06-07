import {Component, Input, OnInit} from '@angular/core';
import {Tx} from '../../core/models';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.css']
})
export class TransactionInfoComponent implements OnInit {
  @Input() transaction: Tx;

  constructor() { }

  ngOnInit() {
  }

}
