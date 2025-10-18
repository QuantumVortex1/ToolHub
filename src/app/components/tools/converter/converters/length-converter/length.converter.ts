import { ConverterDefinition } from '../../converter-types';

export const LENGTH_CONVERTER: ConverterDefinition = {
  id: 'length-converter',
  name: 'Längen-Konverter',
  short: 'Länge',
  description: 'Konvertiert Längeneinheiten wie Meter, Kilometer, Meilen und mehr.',
  route: '/tools/converter/length',
  icon: 'straighten',
  tags: ['länge', 'meter', 'kilometer', 'meilen', 'fuß', 'zoll', 'distanz'],
  baseUnit: 'm',
  units: [
    {
      unit: 'm',
      unitName: 'Meter',
      symbol: 'm',
      toBase: (value: number) => value,
      fromBase: (value: number) => value
    },
    {
      unit: 'km',
      unitName: 'Kilometer',
      symbol: 'km',
      toBase: (value: number) => value * 1000,
      fromBase: (value: number) => value / 1000
    },
    {
      unit: 'cm',
      unitName: 'Zentimeter',
      symbol: 'cm',
      toBase: (value: number) => value / 100,
      fromBase: (value: number) => value * 100
    },
    {
      unit: 'mm',
      unitName: 'Millimeter',
      symbol: 'mm',
      toBase: (value: number) => value / 1000,
      fromBase: (value: number) => value * 1000
    },
    {
      unit: 'mi',
      unitName: 'Meile(n)',
      symbol: 'mi',
      toBase: (value: number) => value * 1609.34,
      fromBase: (value: number) => value / 1609.34
    },
    {
      unit: 'yd',
      unitName: 'Yard(s)',
      symbol: 'yd',
      toBase: (value: number) => value * 0.9144,
      fromBase: (value: number) => value / 0.9144
    },
    {
      unit: 'ft',
      unitName: 'Fuß',
      symbol: 'ft',
      toBase: (value: number) => value * 0.3048,
      fromBase: (value: number) => value / 0.3048
    },
    {
      unit: 'in',
      unitName: 'Zoll',
      symbol: 'in',
      toBase: (value: number) => value * 0.0254,
      fromBase: (value: number) => value / 0.0254
    },
    {
      unit: 'nmi',
      unitName: 'Seemeile(n)',
      symbol: 'nmi',
      toBase: (value: number) => value * 1852,
      fromBase: (value: number) => value / 1852
    },
    {
      unit: 'ly',
      unitName: 'Lichtjahr(e)',
      symbol: 'ly',
      toBase: (value: number) => value * 9.461e15,
      fromBase: (value: number) => value / 9.461e15
    }
  ]
};
