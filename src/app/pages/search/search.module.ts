import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import {SearchRoutingModule} from './search-routing.module';
import {ComponentsModule} from '../../components/components.module';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    ComponentsModule,
    NgxSpinnerModule
  ],
  declarations: [SearchComponent]
})
export class SearchModule { }
