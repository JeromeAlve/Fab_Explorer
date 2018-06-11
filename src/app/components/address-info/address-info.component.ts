import { Component, Input, OnInit } from '@angular/core';
import { AddressInfo } from '../../core/models/address.model';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.css']
})
export class AddressInfoComponent implements OnInit {
  @Input() address: AddressInfo;

  constructor() {
  }

  ngOnInit() {
  }

}
