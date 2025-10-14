export interface ToolEntry {
    id: string;
    name: string;
    description: string;
    route: string;
    tags: string[];
    icon: string;
    }

export function getToolByRoute(route: string): ToolEntry | undefined {
    return TOOL_REGISTRY.find(tool => tool.route === route);
}

export function getFavorites(favoriteRoutes: string[]): ToolEntry[] {
    return favoriteRoutes
        .map(route => getToolByRoute(route))
        .filter(tool => tool !== undefined) as ToolEntry[];
}

export const TOOL_REGISTRY: ToolEntry[] = [
    {
        id: 'home',
        name: 'Startseite',
        description: 'Zurück zur Startseite von ToolHub.',
        route: '/',
        icon: 'home',
        tags: ['home', 'start', 'startseite']
    },
    // {
    //     id: 'converter',
    //     name: 'Einheiten-Konverter',
    //     description: 'Konvertiert Einheiten wie Längen, Gewichte und Volumen.',
    //     route: '/tools/converter',
    //     icon: 'swap_horiz',
    //     tags: ['konverter', 'konvertierung', 'einheiten']
    // },
    {
        id: 'pizza-tool',
        name: 'Pizza-Tool',
        description: 'Berechnet die Größe einer Pizza und den Preis pro Quadratzentimeter.',
        route: '/tools/pizza',
        icon: 'local_pizza',
        tags: ['pizza', 'verhältnis', 'größe', 'preis']
    },
    {
        id: 'alcohol-level',
        name: 'Promille-Rechner',
        description: 'Schätzt den Blutalkoholspiegel basierend auf Getränken, Gewicht und Geschlecht.',
        route: '/tools/alcohol-level',
        icon: 'sports_bar',
        tags: ['alkohol', 'promille', 'blutalkoholspiegel', 'bier', 'wein', 'schnaps']
    },
    {
        id: 'checkout-helper',
        name: 'Kassen-Zählhilfe',
        description: 'Hilft beim Auszählen der Kasse mit automatischer Berechnung für verschiedene Währungen.',
        route: '/tools/checkout-helper',
        icon: 'point_of_sale',
        tags: ['kasse', 'bargeld', 'zählen', 'euro', 'abrechnung']
    }
];