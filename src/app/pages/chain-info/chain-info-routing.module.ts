import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChainInfoComponent} from './chain-info.component';


const routes: Routes = [
  {
    path: '',
    component: ChainInfoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChainInfoRoutingModule {}
