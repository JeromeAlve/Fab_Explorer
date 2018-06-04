import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LatestBlocksComponent } from './latest-blocks.component';
import {LatestBlocksRoutingModule} from './latest-blocks-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LatestBlocksRoutingModule
  ],
  declarations: [LatestBlocksComponent]
})
export class LatestBlocksModule { }
