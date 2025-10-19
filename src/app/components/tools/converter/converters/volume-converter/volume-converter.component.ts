import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { BaseConverterComponent } from '../../services/base-converter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { VOLUME_CONVERTER } from './volume.converter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-volume-converter',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './volume-converter.component.html',
  styleUrl: './volume-converter.component.css'
})
export class VolumeConverterComponent extends BaseConverterComponent {
  override converter = VOLUME_CONVERTER;

  constructor(
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(route, router, location);
    this.defaultUnit = 'l';
  }

  get metricUnits() {
    return this.filterUnitsByIds(['l', 'dl', 'cl', 'ml']);
  }

  get imperialUnits() {
    return this.filterUnitsByIds(['gal', 'qt', 'pt', 'cup', 'floz']);
  }

  get otherUnits() {
    return this.filterUnitsByIds(['m3', 'ft3', 'in3']);
  }
}
