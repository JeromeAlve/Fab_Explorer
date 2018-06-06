import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {SearchRoutingModule} from './search-routing.module';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    ComponentsModule
  ],
  declarations: [SearchComponent]
})
export class SearchModule { }
