import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {path: 'transactions', loadChildren: './pages/view-transaction/view-transaction.module#ViewTransactionModule'},
  {path: 'blocks', loadChildren: './pages/view-block/view-block.module#ViewBlockModule'},
  {path: 'search', loadChildren: './pages/search/search.module#SearchModule'},
  {path: 'chain', loadChildren: './pages/chain-info/chain-info.module#ChainInfoModule'},
  {path: 'latest-blocks', loadChildren: './pages/latest-blocks/latest-blocks.module#LatestBlocksModule'},
  {path: 'address-info', loadChildren: './pages/address/address.module#AddressModule'},
  {path: '', redirectTo: 'latest-blocks', pathMatch: 'full'},
  {path: '**', redirectTo: 'latest-blocks'},
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
