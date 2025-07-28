export interface UnitGroup {
    category: string;
    baseUnit: string;
    units: UnitDefinition[];
}

export interface UnitDefinition {
    unit: string; // user input
    symbol: string; // displayed symbol
    toBase: (value: number) => number;
    fromBase: (value: number) => number;
}

export const CONVERSION_SUGGESTIONS: UnitGroup[] = [
    {
        category: 'Längen',
        baseUnit: 'm',
        units: [
            {
                unit: 'm',
                symbol: 'm',
                toBase: (value: number) => value,
                fromBase: (value: number) => value
            },
            {
                unit: 'km',
                symbol: 'km',
                toBase: (value: number) => value * 1000,
                fromBase: (value: number) => value / 1000
            },
            {
                unit: 'cm',
                symbol: 'cm',
                toBase: (value: number) => value / 100,
                fromBase: (value: number) => value * 100
            },
            {
                unit: 'mm',
                symbol: 'mm',
                toBase: (value: number) => value / 1000,
                fromBase: (value: number) => value * 1000
            },
            {
                unit: 'mi',
                symbol: 'mi',
                toBase: (value: number) => value * 1609.34,
                fromBase: (value: number) => value / 1609.34
            },
            {
                unit: 'yd',
                symbol: 'yd',
                toBase: (value: number) => value * 0.9144,
                fromBase: (value: number) => value / 0.9144
            },
            {
                unit: 'ft',
                symbol: 'ft',
                toBase: (value: number) => value * 0.3048,
                fromBase: (value: number) => value / 0.3048
            },
            {
                unit: 'in',
                symbol: 'in',
                toBase: (value: number) => value * 0.0254,
                fromBase: (value: number) => value / 0.0254
            },
            {
                unit: 'nmi',
                symbol: 'nmi',
                toBase: (value: number) => value * 1852,
                fromBase: (value: number) => value / 1852
            }
        ]
    },
    {
        category: 'Temperaturen',
        baseUnit: 'K',
        units: [
            {
                unit: 'k',
                symbol: 'K',
                toBase: (value: number) => value,
                fromBase: (value: number) => value
            },
            {
                unit: 'c',
                symbol: '°C',
                toBase: (value: number) => value + 273.15,
                fromBase: (value: number) => value - 273.15
            },
            {
                unit: 'f',
                symbol: '°F',
                toBase: (value: number) => (value - 32) * 5 / 9 + 273.15,
                fromBase: (value: number) => (value - 273.15) * 9 / 5 + 32
            }
        ]
    }
]