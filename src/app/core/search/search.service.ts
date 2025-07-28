import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { parseInput } from './input-parser.util';
import { TOOL_REGISTRY } from '../tools/tools.registry';
import { convertSuggestions } from './unit-converter.util';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private router: Router) { }

  search(query: string): SearchResult[] {
    query = query.trim().toLowerCase();

    if (!query) return [];

    var results: SearchResult[] = [];
    const descResults: SearchResult[] = [];

    const parsed = parseInput(query);
    if (parsed) {
      const { value, unit } = parsed;
      results = convertSuggestions(value, unit);
    }

    TOOL_REGISTRY.forEach(tool => {
      if (tool.name.toLowerCase().includes(query)) {
        results.push({
          type: 'tool',
          display: tool.name,
          route: tool.route
        });
      } else if (tool.description.toLowerCase().includes(query)) {
        descResults.push({
          type: 'tool',
          display: tool.name,
          route: tool.route
        });
      }
    });
    results = results.concat(descResults);

    return results;
  }
}

export interface SearchResult {
  type: string;
  display: string;
  route: string;
}