import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ComponentsModule } from '../../components/components.module';
import { TopAddressesRoutingModule } from './top-addresses-routing.module';
import { TopAddressesComponent } from './top-addresses.component';

@NgModule({
  imports: [
    CommonModule,
    TopAddressesRoutingModule,
    NgxSpinnerModule,
    ComponentsModule,
    PaginationModule
  ],
  declarations: [TopAddressesComponent]
})
export class TopAddressesModule { }
