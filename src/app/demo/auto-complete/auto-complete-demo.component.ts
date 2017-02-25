import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { of } from 'rxjs/Observable/of';
import { Jsonp, URLSearchParams } from '@angular/http';


@Component({
  selector: 're-auto-complete-demo',
  templateUrl: './auto-complete-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'autocomplete': 'off',
    'autocapitalize': 'off',
    'autocorrect': 'off'
  },
})
export class AutoCompleteDemoComponent implements OnInit {
  selectItem1: string;
  selectItem2: string;
  selectItem3: string;
  icons = ['glyphicon-asterisk', 'glyphicon glyphicon-plus', 'glyphicon glyphicon-euro', 'glyphicon glyphicon-eu'];

  constructor(private jsonp: Jsonp) {
  }

  ngOnInit() {
  }

  getIcon(index) {
    return this.icons[index % this.icons.length];
  }

  onSearchLocal(term) {
    return of(['C#', 'C', 'C++', 'CPython', 'Java', 'JavaScript', 'Go', 'Python', 'Ruby', 'F#', 'TypeScript', 'SQL',
      'LiveScript', 'CoffeeScript']
      .filter(lang => lang.toLowerCase().indexOf(term.toLowerCase()) !== -1));
  }

  onSearch(term) {
    return this.searchWiki(term);
  }

  searchWiki(term) {
    const params = new URLSearchParams();
    params.set('search', term);
    params.set('action', 'opensearch');
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');

    return this.jsonp
      .get('https://en.wikipedia.org/w/api.php', { search: params })
      .map(response => <string[]> response.json()[1]);
  }
}
