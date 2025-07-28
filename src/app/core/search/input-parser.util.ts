export function parseInput(input: string): {value: number, unit: string} | null {
    const match = input.match(/^(-?[\d.,]+)\s*([a-zA-Z]+\^?\d*)$/);
    if (!match) return null;

    const value = parseFloat(match[1].replace(',', '.'));
    const unit = match[2].toLowerCase();

    return { value, unit };
}