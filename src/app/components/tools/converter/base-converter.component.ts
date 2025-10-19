import { OnInit, Directive } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConverterDefinition, UnitDefinition } from './converter-types';

export interface UnitCard {
  unit: UnitDefinition;
  value: number | null;
}

@Directive()
export abstract class BaseConverterComponent implements OnInit {
  abstract converter: ConverterDefinition;
  unitCards: UnitCard[] = [];

  protected baseValue: number | null = null;
  protected lastEditedUnit: UnitDefinition | null = null;
  protected defaultUnit: string = '';
  protected precision: number = 12;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location
  ) {}

  ngOnInit() {
    this.initializeUnitCards();
    this.subscribeToQueryParams();
  }

  protected initializeUnitCards(): void {
    this.unitCards = this.converter.units.map(unit => ({
      unit,
      value: null
    }));
  }

  protected subscribeToQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      const value = params['value'];
      const unit = params['unit'] || this.defaultUnit || this.converter.baseUnit;

      if (value) {
        const initialValue = parseFloat(value);
        const initialUnit = this.converter.units.find(u => u.unit === unit);

        if (initialUnit && !isNaN(initialValue)) this.updateFromInput(initialUnit, initialValue);
      }
    });
  }

  onInputChange(card: UnitCard): void {
    if (card.value !== null && card.value !== undefined && !isNaN(card.value)) {
      this.updateFromInput(card.unit, card.value);
      this.updateUrl(card.unit, card.value);
    } else {
      this.clearAllValues(card);
    }
  }

  protected clearAllValues(excludeCard?: UnitCard): void {
    this.baseValue = null;
    this.unitCards.forEach(c => {
      if (c !== excludeCard) c.value = null;
    });
  }

  protected updateFromInput(sourceUnit: UnitDefinition, value: number): void {
    this.lastEditedUnit = sourceUnit;
    this.baseValue = sourceUnit.toBase(value);

    this.unitCards.forEach(card => {
      if (card.unit !== sourceUnit) {
        const convertedValue = card.unit.fromBase(this.baseValue!);
        card.value = this.roundToPrecision(convertedValue, this.precision);
      } else {
        card.value = value;
      }
    });
  }

  protected roundToPrecision(value: number, precision: number): number {
    if (value === 0) return 0;
    const multiplier = Math.pow(10, precision - Math.floor(Math.log10(Math.abs(value))) - 1);
    return Math.round(value * multiplier) / multiplier;
  }

  protected updateUrl(unit: UnitDefinition, value: number): void {
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

  protected filterUnitsByIds(unitIds: string[]): UnitCard[] {
    return this.unitCards.filter(c => unitIds.includes(c.unit.unit));
  }
}
