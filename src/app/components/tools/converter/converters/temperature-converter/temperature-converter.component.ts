import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TEMPERATURE_CONVERTER } from './temperature.converter';
import { UnitDefinition } from '../../converter-types';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

interface UnitCard {
  unit: UnitDefinition;
  value: number | null;
}

@Component({
  selector: 'app-temperature-converter',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './temperature-converter.component.html',
  styleUrl: './temperature-converter.component.css'
})
export class TemperatureConverterComponent implements OnInit {
  converter = TEMPERATURE_CONVERTER;
  unitCards: UnitCard[] = [];

  private baseValue: number | null = null;
  private lastEditedUnit: UnitDefinition | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.unitCards = this.converter.units.map(unit => ({
      unit,
      value: null
    }));

    this.route.queryParams.subscribe(params => {
      const value = params['value'] || 0;
      const unit = params['unit'] || 'c';

      const initialValue = parseFloat(value);
      const initialUnit = this.converter.units.find(u => u.unit === unit);

      if (initialUnit && !isNaN(initialValue)) this.updateFromInput(initialUnit, initialValue);
    });
  }

  onInputChange(card: UnitCard) {
    if (card.value !== null && card.value !== undefined && !isNaN(card.value)) {
      this.updateFromInput(card.unit, card.value);
      this.updateUrl(card.unit, card.value);
    } else {
      this.baseValue = null;
      this.unitCards.forEach(c => {
        if (c !== card) c.value = null;
      });
    }
  }

  private updateFromInput(sourceUnit: UnitDefinition, value: number) {
    this.lastEditedUnit = sourceUnit;
    this.baseValue = sourceUnit.toBase(value);

    this.unitCards.forEach(card => {
      if (card.unit !== sourceUnit) {
        let convertedValue = card.unit.fromBase(this.baseValue!);
        card.value = this.roundToPrecision(convertedValue, 12);
      } else {
        card.value = value;
      }
    });
  }

  private roundToPrecision(value: number, precision: number): number {
    if (value === 0) return 0;
    const multiplier = Math.pow(10, precision - Math.floor(Math.log10(Math.abs(value))) - 1);
    return Math.round(value * multiplier) / multiplier;
  }

  private updateUrl(unit: UnitDefinition, value: number) {
    const urlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: {
        value: value.toString(),
        unit: unit.unit
      },
      queryParamsHandling: 'merge'
    });

    this.location.replaceState(urlTree.toString());
  }

  isHighlighted(card: UnitCard): boolean {
    return this.lastEditedUnit === card.unit;
  }
}
