import { ConverterDefinition } from '../../converter-types';

export const WEIGHT_CONVERTER: ConverterDefinition = {
  id: 'weight-converter',
  name: 'Gewichts-Konverter',
  short: 'Gewicht',
  description: 'Konvertiert Gewichtseinheiten wie Kilogramm, Gramm, Pfund und mehr.',
  route: '/tools/converter/weight',
  icon: 'scale',
  tags: ['gewicht', 'kilogramm', 'gramm', 'pfund', 'unze', 'tonne'],
  baseUnit: 'kg',
  units: [
    {
      unit: 'kg',
      unitName: 'Kilogramm',
      symbol: 'kg',
      toBase: (value: number) => value,
      fromBase: (value: number) => value
    },
    {
      unit: 'g',
      unitName: 'Gramm',
      symbol: 'g',
      toBase: (value: number) => value / 1000,
      fromBase: (value: number) => value * 1000
    },
    {
      unit: 'mg',
      unitName: 'Milligramm',
      symbol: 'mg',
      toBase: (value: number) => value / 1000000,
      fromBase: (value: number) => value * 1000000
    },
    {
      unit: 't',
      unitName: 'Tonne(n)',
      symbol: 't',
      toBase: (value: number) => value * 1000,
      fromBase: (value: number) => value / 1000
    },
    {
      unit: 'lb',
      unitName: 'Pfund',
      symbol: 'lb',
      toBase: (value: number) => value * 0.453592,
      fromBase: (value: number) => value / 0.453592
    },
    {
      unit: 'oz',
      unitName: 'Unze(n)',
      symbol: 'oz',
      toBase: (value: number) => value * 0.0283495,
      fromBase: (value: number) => value / 0.0283495
    }
  ]
};
