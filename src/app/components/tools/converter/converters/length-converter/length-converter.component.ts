import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LENGTH_CONVERTER } from './length.converter';
import { UnitDefinition } from '../../converter-types';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

interface UnitCard {
  unit: UnitDefinition;
  value: number | null;
}

@Component({
  selector: 'app-length-converter',
  imports: [CommonModule, FormsModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './length-converter.component.html',
  styleUrl: './length-converter.component.css'
})
export class LengthConverterComponent implements OnInit {
  converter = LENGTH_CONVERTER;
  unitCards: UnitCard[] = [];
  
  private baseValue: number | null = null;
  private lastEditedUnit: UnitDefinition | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.unitCards = this.converter.units.map(unit => ({
      unit,
      value: null
    }));

    this.route.queryParams.subscribe(params => {
      const value = params['value'];
      const unit = params['unit'] || 'm';
      
      if (value) {
        const initialValue = parseFloat(value);
        const initialUnit = this.converter.units.find(u => u.unit === unit);
        
        if (initialUnit && !isNaN(initialValue))  this.updateFromInput(initialUnit, initialValue);
      }
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

  get metricUnits(): UnitCard[] {
    return this.unitCards.filter(c => 
      ['km', 'm', 'cm', 'mm'].includes(c.unit.unit)
    );
  }

  get imperialUnits(): UnitCard[] {
    return this.unitCards.filter(c => 
      ['mi', 'yd', 'ft', 'in'].includes(c.unit.unit)
    );
  }

  get otherUnits(): UnitCard[] {
    return this.unitCards.filter(c => 
      ['nmi', 'ly'].includes(c.unit.unit)
    );
  }
}

