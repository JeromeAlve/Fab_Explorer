import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBlockComponent } from './view-block.component';
import {ViewBlockResolverService} from './view-block-resolver.service';
import {ViewBlockRoutingModule} from './view-block-routing.module';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ViewBlockRoutingModule
  ],
  declarations: [ViewBlockComponent],
  providers: [ViewBlockResolverService]
})
export class ViewBlockModule { }
