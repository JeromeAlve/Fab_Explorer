import {Component, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() searchOptions: any;
  @Output() searchValue: string;

  value: string;

  constructor() { }

  ngOnInit() {
  }

}
