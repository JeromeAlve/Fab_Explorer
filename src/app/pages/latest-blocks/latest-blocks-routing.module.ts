import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LatestBlocksComponent} from './latest-blocks.component';

const routes: Routes = [
  {
    path: '',
    component: LatestBlocksComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LatestBlocksRoutingModule {}
