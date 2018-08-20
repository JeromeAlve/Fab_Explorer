import { Component, OnInit } from '@angular/core';
import { Tx } from '../../core/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.css']
})
export class ViewTransactionComponent implements OnInit {
  transaction: Tx;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((data: { transaction: Tx }) => {
      this.transaction = data.transaction;
    });
  }
}
