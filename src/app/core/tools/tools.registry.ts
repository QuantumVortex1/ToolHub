export interface ToolEntry {
    id: string;
    name: string;
    description: string;
    route: string;
    tags: string[];
    }

export const TOOL_REGISTRY: ToolEntry[] = [
    {
        id: 'converter',
        name: 'Einheiten-Konverter',
        description: 'Konvertiert Einheiten wie Längen, Gewichte und Volumen.',
        route: '/tools/converter',
        tags: ['konverter', 'konvertierung', 'einheiten']
    },
    {
        id: 'pizza-tool',
        name: 'Pizza-Tool',
        description: 'Berechnet die Größe einer Pizza und den Preis pro Quadratzentimeter.',
        route: '/tools/pizza',
        tags: ['pizza', 'verhältnis', 'größe', 'preis']
    }
];