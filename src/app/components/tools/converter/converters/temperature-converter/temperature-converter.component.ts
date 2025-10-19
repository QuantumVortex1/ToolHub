import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TEMPERATURE_CONVERTER } from './temperature.converter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseConverterComponent } from '../../base-converter.component';

@Component({
  selector: 'app-temperature-converter',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './temperature-converter.component.html',
  styleUrl: './temperature-converter.component.css'
})
export class TemperatureConverterComponent extends BaseConverterComponent {
  override converter = TEMPERATURE_CONVERTER;

  constructor(
    route: ActivatedRoute,
    router: Router,
    location: Location
  ) {
    super(route, router, location);
    this.defaultUnit = 'c';
  }
}
