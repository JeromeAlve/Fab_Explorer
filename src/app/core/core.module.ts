import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService, StateService} from './services';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ApiService,
    StateService
  ],
  declarations: []
})
export class CoreModule {
}
