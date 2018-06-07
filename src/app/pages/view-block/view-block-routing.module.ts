import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewBlockComponent } from './view-block.component';
import {ViewBlockResolverService} from './view-block-resolver.service';


const routes: Routes = [
  {
    path: ':blockHash',
    component: ViewBlockComponent,
    resolve: {
      block: ViewBlockResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewBlockRoutingModule {}
