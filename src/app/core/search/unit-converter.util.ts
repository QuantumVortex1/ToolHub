import { CONVERSION_SUGGESTIONS } from "../../conf/conversion-suggestions.config";

export function convert(value: number, fromUnit: string, toUnit: string){
    const unitGroup = CONVERSION_SUGGESTIONS.find(group => group.units.some(u => u.unit === fromUnit));
    if (!unitGroup) return null;

    const fromDef = unitGroup.units.find(u => u.unit === fromUnit);
    const toDef = unitGroup.units.find(u => u.unit === toUnit);

    if (!fromDef || !toDef) return null;

    const baseValue = fromDef.toBase(value);
    return toDef.fromBase(baseValue);
}

export function convertSuggestions(value: number, unit: string): {type: string, display: string, route: string}[] {
    const unitGroup = CONVERSION_SUGGESTIONS.find(group => group.units.some(u => u.unit === unit));
    if (!unitGroup) return [];

    const fromDef = unitGroup.units.find(u => u.unit === unit);
    if (!fromDef) return [];

    const baseValue = fromDef.toBase(value);

    const results = unitGroup.units
        .filter(u => u.unit !== unit)
        .map(u => ({
            type: 'conversion',
            display: u.fromBase(baseValue).toString() + ' ' + u.symbol,
            route: `/converter?value=${value}&from=${unit}&to=${u.unit}`
        }));

    return results;
}