import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChainInfoComponent} from './chain-info.component';
import {ChainInfoRoutingModule} from './chain-info-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ChainInfoRoutingModule
  ],
  declarations: [ChainInfoComponent]
})
export class ChainInfoModule {
}
