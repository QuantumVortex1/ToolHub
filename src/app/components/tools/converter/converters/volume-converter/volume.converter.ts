import { ConverterDefinition } from '../../converter-types';

export const VOLUME_CONVERTER: ConverterDefinition = {
  id: 'volume-converter',
  name: 'Volumen-Konverter',
  short: 'Volumen',
  description: 'Konvertiert Volumeneinheiten wie Liter, Milliliter, Gallonen und mehr.',
  route: '/tools/converter/volume',
  icon: 'water_drop',
  tags: ['volumen', 'liter', 'milliliter', 'gallone', 'flüssigkeit'],
  baseUnit: 'l',
  units: [
    {
      unit: 'l',
      unitName: 'Liter',
      symbol: 'l',
      toBase: (value: number) => value,
      fromBase: (value: number) => value
    },
    {
      unit: 'ml',
      unitName: 'Milliliter',
      symbol: 'ml',
      toBase: (value: number) => value / 1000,
      fromBase: (value: number) => value * 1000
    },
    {
      unit: 'cl',
      unitName: 'Zentiliter',
      symbol: 'cl',
      toBase: (value: number) => value / 100,
      fromBase: (value: number) => value * 100
    },
    {
      unit: 'dl',
      unitName: 'Deziliter',
      symbol: 'dl',
      toBase: (value: number) => value / 10,
      fromBase: (value: number) => value * 10
    },
    {
      unit: 'm3',
      unitName: 'Kubikmeter',
      symbol: 'm³',
      toBase: (value: number) => value * 1000,
      fromBase: (value: number) => value / 1000
    },
    {
      unit: 'ft3',
      unitName: 'Kubikfuß',
      symbol: 'ft³',
      toBase: (value: number) => value * 28.3168,
      fromBase: (value: number) => value / 28.3168
    },
    {
      unit: 'in3',
      unitName: 'Kubikzoll',
      symbol: 'in³',
      toBase: (value: number) => value * 0.0163871,
      fromBase: (value: number) => value / 0.0163871
    },
    {
      unit: 'gal',
      unitName: 'US-Gallone(n)',
      symbol: 'gal (US)',
      toBase: (value: number) => value * 3.78541,
      fromBase: (value: number) => value / 3.78541
    },
    {
      unit: 'qt',
      unitName: 'US-Quart(s)',
      symbol: 'qt (US)',
      toBase: (value: number) => value * 0.946353,
      fromBase: (value: number) => value / 0.946353
    },
    {
      unit: 'pt',
      unitName: 'US-Pint(s)',
      symbol: 'pt (US)',
      toBase: (value: number) => value * 0.473176,
      fromBase: (value: number) => value / 0.473176
    },
    {
      unit: 'cup',
      unitName: 'US-Cup(s)',
      symbol: 'cup (US)',
      toBase: (value: number) => value * 0.236588,
      fromBase: (value: number) => value / 0.236588
    },
    {
      unit: 'floz',
      unitName: 'US-Flüssigunze(n)',
      symbol: 'fl oz (US)',
      toBase: (value: number) => value * 0.0295735,
      fromBase: (value: number) => value / 0.0295735
    }
  ]
};
