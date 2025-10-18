import { ConverterDefinition } from '../../converter-types';

export const TEMPERATURE_CONVERTER: ConverterDefinition = {
  id: 'temperature-converter',
  name: 'Temperatur-Konverter',
  short: 'Temperatur',
  description: 'Konvertiert Temperatureinheiten wie Celsius, Fahrenheit und Kelvin.',
  route: '/tools/converter/temperature',
  icon: 'thermostat',
  tags: ['temperatur', 'celsius', 'fahrenheit', 'kelvin', 'grad'],
  baseUnit: 'K',
  units: [
    {
      unit: 'k',
      unitName: 'Kelvin',
      symbol: 'K',
      toBase: (value: number) => value,
      fromBase: (value: number) => value
    },
    {
      unit: 'c',
      unitName: 'Celsius',
      symbol: '°C',
      toBase: (value: number) => value + 273.15,
      fromBase: (value: number) => value - 273.15
    },
    {
      unit: 'f',
      unitName: 'Fahrenheit',
      symbol: '°F',
      toBase: (value: number) => (value - 32) * 5 / 9 + 273.15,
      fromBase: (value: number) => (value - 273.15) * 9 / 5 + 32
    }
  ]
};
