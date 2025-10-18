import { CONVERTERS_REGISTRY } from "../../components/tools/converter/converters.registry";

export function convert(value: number, fromUnit: string, toUnit: string){
    const converter = CONVERTERS_REGISTRY.find(c => c.units.some(u => u.unit === fromUnit));
    if (!converter) return null;

    const fromDef = converter.units.find(u => u.unit === fromUnit);
    const toDef = converter.units.find(u => u.unit === toUnit);

    if (!fromDef || !toDef) return null;

    const baseValue = fromDef.toBase(value);
    return toDef.fromBase(baseValue);
}

export function convertSuggestions(value: number, unit: string): {type: string, display: string, route: string}[] {
    const converter = CONVERTERS_REGISTRY.find(c => c.units.some(u => u.unit === unit));
    if (!converter) return [];

    const fromDef = converter.units.find(u => u.unit === unit);
    if (!fromDef) return [];

    const baseValue = fromDef.toBase(value);

    const results = converter.units
        .filter(u => u.unit !== unit)
        .map(u => ({
            type: 'conversion',
            display: `${u.fromBase(baseValue).toString()} ${u.symbol}`,
            route: converter.route
        }));

    return results;
}