import { Component, Input, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap';
import { TxSummary } from '../../core/models/transaction.model';

@Component({
  selector: 'app-address-transaction-detail',
  templateUrl: './address-transaction-detail.component.html',
  styleUrls: ['./address-transaction-detail.component.css']
})
export class AddressTransactionDetailComponent implements OnInit {

  @Input() transactions: TxSummary[];
  displayedTransactions: TxSummary[];
  itemsPerPage = 10;
  rotate = true;
  maxPagesDisplayed = 5;

  constructor() {
  }

  ngOnInit() {
    // this.transactions = this.transactions.reverse();
    this.displayedTransactions = this.transactions.slice(0, this.itemsPerPage);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.displayedTransactions = this.transactions.slice(startItem, endItem);
  }
}
