import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {BlockInfoComponent} from './block-info/block-info.component';
import {TransactionInfoComponent} from './transaction-info/transaction-info.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  declarations: [
    NavBarComponent,
    SearchBarComponent,
    BlockInfoComponent,
    TransactionInfoComponent
  ],
  exports: [
    NavBarComponent,
    SearchBarComponent,
    BlockInfoComponent,
    TransactionInfoComponent
  ]
})
export class ComponentsModule {
}
