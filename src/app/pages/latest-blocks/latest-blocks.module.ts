import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { LatestBlocksComponent } from './latest-blocks.component';
import { LatestBlocksRoutingModule } from './latest-blocks-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LatestBlocksRoutingModule,
    CoreModule
  ],
  declarations: [LatestBlocksComponent]
})
export class LatestBlocksModule {
}
