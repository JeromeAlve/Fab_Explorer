import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() searchValue = '';

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  search() {
    this.router.navigate(['/search', this.searchValue])
      .catch(err => console.error(err));
  }

  onKey(event: any) {
    if (event.keyCode === 13) {
      this.search();
    } else {
      this.searchValue = event.target.value;
    }
  }

}
