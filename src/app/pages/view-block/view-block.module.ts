import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBlockComponent } from './view-block.component';
import {ViewBlockResolverService} from './view-block-resolver.service';

@NgModule({
  imports: [
    CommonModule,
    ViewBlockResolverService
  ],
  declarations: [ViewBlockComponent],
  providers: [ViewBlockResolverService]
})
export class ViewBlockModule { }
