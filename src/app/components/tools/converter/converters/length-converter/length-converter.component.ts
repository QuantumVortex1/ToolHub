import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LENGTH_CONVERTER } from './length.converter';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseConverterComponent } from '../../services/base-converter.component';

@Component({
  selector: 'app-length-converter',
  imports: [CommonModule, FormsModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './length-converter.component.html',
  styleUrl: './length-converter.component.css'
})
export class LengthConverterComponent extends BaseConverterComponent {
  override converter = LENGTH_CONVERTER;

  constructor(
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(route, router, location);
    this.defaultUnit = 'm';
  }

  get metricUnits() {
    return this.filterUnitsByIds(['km', 'm', 'cm', 'mm']);
  }

  get imperialUnits() {
    return this.filterUnitsByIds(['mi', 'yd', 'ft', 'in']);
  }

  get otherUnits() {
    return this.filterUnitsByIds(['nmi', 'ly']);
  }
}

