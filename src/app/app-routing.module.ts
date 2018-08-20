import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {path: 'transactions', loadChildren: './pages/view-transaction/view-transaction.module#ViewTransactionModule'},
  {path: 'blocks', loadChildren: './pages/view-block/view-block.module#ViewBlockModule'},
  {path: 'search', loadChildren: './pages/search/search.module#SearchModule'},
  {path: 'chain', loadChildren: './pages/chain-info/chain-info.module#ChainInfoModule'},
  {path: 'latest-blocks', loadChildren: './pages/latest-blocks/latest-blocks.module#LatestBlocksModule'},
  {path: 'address-info', loadChildren: './pages/address/address.module#AddressModule'},
<<<<<<< HEAD
  {path: 'monitoring', loadChildren: './pages/monitoring/monitoring.module#MonitoringModule'},
=======
  {path: 'top-addresses', loadChildren: './pages/top-addresses/top-addresses.module#TopAddressesModule'},
>>>>>>> 15320edc2c6e9c9e1e1ca314d0f8cce3f66fd7ce
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
