import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewTransactionComponent} from './view-transaction.component';
import {ViewTransactionRoutingModule} from './view-transaction-routing.module';
import {ViewTransactionResolverService} from './view-transaction-resolver.service';

@NgModule({
  imports: [
    CommonModule,
    ViewTransactionRoutingModule
  ],
  declarations: [ViewTransactionComponent],
  providers: [ViewTransactionResolverService]
})
export class ViewTransactionModule {
}
