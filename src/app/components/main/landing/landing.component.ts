import { Component } from '@angular/core';
import { parseInput } from '../../../core/search/input-parser.util';
import { SearchService } from '../../../core/search/search.service';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(searchService: SearchService) {
    // const exampleQueries = [
    //   '1000m',
    //   '100cm',
    //   '5 km',
    //   'Konverter',
    //   'len',
    //   'sdadsas',
    //   '1000',
    //   'km'
    // ];
    // exampleQueries.forEach(query => {
    //   const { value, unit } = parseInput(query) || {};
    //   const results = searchService.search(query);
    //   console.log(value, unit, results);
    // })
  }
}
