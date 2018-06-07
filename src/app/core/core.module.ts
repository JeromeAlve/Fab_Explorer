import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApiService, StateService} from './services';
import {HttpClientModule} from '@angular/common/http';
import {UtilsService} from './services/utils.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ApiService,
    StateService,
    UtilsService
  ],
  declarations: []
})
export class CoreModule {
}
