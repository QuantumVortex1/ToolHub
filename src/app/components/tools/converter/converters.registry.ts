import { ConverterDefinition } from './converter-types';
import { LENGTH_CONVERTER } from './converters/length-converter/length.converter';
import { TEMPERATURE_CONVERTER } from './converters/temperature-converter/temperature.converter';
import { WEIGHT_CONVERTER } from './converters/weight-converter/weight.converter';
import { VOLUME_CONVERTER } from './converters/volume-converter/volume.converter';

export const CONVERTERS_REGISTRY: ConverterDefinition[] = [
  LENGTH_CONVERTER,
  TEMPERATURE_CONVERTER,
  WEIGHT_CONVERTER,
  VOLUME_CONVERTER
];

export function getConverterByRoute(route: string): ConverterDefinition | undefined {
  return CONVERTERS_REGISTRY.find(converter => converter.route === route);
}