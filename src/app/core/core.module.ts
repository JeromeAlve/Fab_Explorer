import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertDatePipe } from './pipes/convert-date.pipe';
import { ApiService, StateService } from './services';
import { HttpClientModule } from '@angular/common/http';
import { CacheService } from './services/cache.service';
import { UtilsService } from './services/utils.service';

const SERVICES = [
  ApiService,
  StateService,
  UtilsService,
  CacheService
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: SERVICES,
  declarations: [
    ConvertDatePipe
  ],
  exports: [
    ConvertDatePipe
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: SERVICES
    };
  }
}
