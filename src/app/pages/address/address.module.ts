import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddressRoutingModule } from './address-routing.module';
import { AddressComponent } from './address.component';
import { ComponentsModule } from '../../components/components.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    AddressRoutingModule,
    ComponentsModule,
    NgxSpinnerModule
  ],
  declarations: [AddressComponent]
})
export class AddressModule {
}
