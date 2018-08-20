import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { MonitoringComponent } from './monitoring.component';
import { MonitoringRoutingModule } from './monitoring-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MonitoringRoutingModule,
    CoreModule
  ],
  declarations: [MonitoringComponent]
})
export class MonitoringModule {
}