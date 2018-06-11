import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewTransactionResolverService } from './view-transaction-resolver.service';
import { ViewTransactionComponent } from './view-transaction.component';


const routes: Routes = [
  {
    path: ':transactionHash',
    component: ViewTransactionComponent,
    resolve: {
      transaction: ViewTransactionResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewTransactionRoutingModule {
}
