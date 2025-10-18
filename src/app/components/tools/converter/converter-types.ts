export interface UnitDefinition {
  unit: string;        // user input (z.B. 'km', 'm')
  unitName: string;    // long name (z.B. 'kilometer', 'meter')
  symbol: string;      // displayed symbol (z.B. 'km', 'm')
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface ConverterDefinition {
  id: string;
  name: string;
  short: string;
  description: string;
  route: string;
  icon: string;
  tags: string[];
  baseUnit: string;
  units: UnitDefinition[];
}
