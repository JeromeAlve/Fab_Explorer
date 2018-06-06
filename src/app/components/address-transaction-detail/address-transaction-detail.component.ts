import {Component, Input, OnInit} from '@angular/core';
import {UTXO} from '../../core/models';
import {PageChangedEvent} from 'ngx-bootstrap';

@Component({
  selector: 'app-address-transaction-detail',
  templateUrl: './address-transaction-detail.component.html',
  styleUrls: ['./address-transaction-detail.component.css']
})
export class AddressTransactionDetailComponent implements OnInit {

  @Input() transactions: UTXO[];
  displayedTransactions: UTXO[];
  itemsPerPage = 10;
  rotate = true;
  maxPagesDisplayed = 5;

  constructor(
  ) {
  }

  ngOnInit() {
    this.displayedTransactions = this.transactions.slice(0, this.itemsPerPage);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.displayedTransactions = this.transactions.slice(startItem, endItem);
  }
}
