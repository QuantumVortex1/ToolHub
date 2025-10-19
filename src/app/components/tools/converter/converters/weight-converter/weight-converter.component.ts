import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { BaseConverterComponent } from '../../services/base-converter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WEIGHT_CONVERTER } from './weight.converter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weight-converter',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './weight-converter.component.html',
  styleUrl: './weight-converter.component.css'
})
export class WeightConverterComponent extends BaseConverterComponent {
  override converter = WEIGHT_CONVERTER;

  constructor(
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(route, router, location);
    this.defaultUnit = 'kg';
  }

  get metricUnits() {
    return this.filterUnitsByIds(['t', 'kg', 'g', 'mg']);
  }

  get imperialUnits() {
    return this.filterUnitsByIds(['lb', 'oz', 'st']);
  }
}
