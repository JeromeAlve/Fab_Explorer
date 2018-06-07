import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {BlockInfoComponent} from './block-info/block-info.component';
import {TransactionInfoComponent} from './transaction-info/transaction-info.component';
import {RouterModule} from '@angular/router';
import {AddressInfoComponent} from './address-info/address-info.component';
import {AddressTransactionDetailComponent} from './address-transaction-detail/address-transaction-detail.component';
import {BsDropdownModule, PaginationModule} from 'ngx-bootstrap';
import {ConvertDatePipe} from './address-transaction-detail/convert-date.pipe';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule,
    RouterModule,
    NgbModule,
    PaginationModule,
    NgxSpinnerModule
  ],
  declarations: [
    NavBarComponent,
    SearchBarComponent,
    BlockInfoComponent,
    TransactionInfoComponent,
    AddressInfoComponent,
    AddressTransactionDetailComponent,
    ConvertDatePipe
  ],
  exports: [
    NavBarComponent,
    SearchBarComponent,
    BlockInfoComponent,
    TransactionInfoComponent,
    AddressInfoComponent,
    AddressTransactionDetailComponent
  ]
})
export class ComponentsModule {
}
