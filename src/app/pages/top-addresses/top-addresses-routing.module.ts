import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopAddressesComponent } from './top-addresses.component';


const routes: Routes = [
  {
    path: '',
    component: TopAddressesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopAddressesRoutingModule {
}
