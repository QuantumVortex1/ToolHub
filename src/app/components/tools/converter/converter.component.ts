import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CONVERTERS_REGISTRY, getConverterByRoute } from './converters.registry';
import { ConverterDefinition } from './converter-types';
import { LengthConverterComponent } from './converters/length-converter/length-converter.component';
import { TemperatureConverterComponent } from './converters/temperature-converter/temperature-converter.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-converter',
  imports: [
    CommonModule, 
    RouterModule, 
    LengthConverterComponent,
    TemperatureConverterComponent,
    MatIconModule
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css'
})
export class ConverterComponent implements OnInit {
  converters = CONVERTERS_REGISTRY;
  activeConverter: ConverterDefinition | null = null;
  isOverviewRoute = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      if (!type) {
        this.isOverviewRoute = true;
        this.activeConverter = null;
      } else {
        this.isOverviewRoute = false;
        const fullRoute = `/tools/converter/${type}`;
        this.activeConverter = getConverterByRoute(fullRoute) || null;
      }
    });
  }

  selectConverter(converter: ConverterDefinition) {
    this.router.navigate([converter.route]);
  }

  isActive(converter: ConverterDefinition): boolean {
    return this.activeConverter?.id === converter.id;
  }
}
