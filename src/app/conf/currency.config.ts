export interface CurrencyDenomination {
  value: number;
  type: 'note' | 'coin';
  color?: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  denominations: CurrencyDenomination[];
}

export const CURRENCY_CONFIG: Currency[] = [
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    denominations: [
      { value: 500, type: 'note', color: '#7b1fa2' },
      { value: 200, type: 'note', color: '#ef6c00' },
      { value: 100, type: 'note', color: '#388e3c' },
      { value: 50, type: 'note', color: '#f57c00' },
      { value: 20, type: 'note', color: '#1976d2' },
      { value: 10, type: 'note', color: '#d32f2f' },
      { value: 5, type: 'note', color: '#616161' },
      
      { value: 2, type: 'coin', color: '#fbc02d' },
      { value: 1, type: 'coin', color: '#fbc02d' },
      { value: 0.5, type: 'coin', color: '#ff8f00' },
      { value: 0.2, type: 'coin', color: '#ff8f00' },
      { value: 0.1, type: 'coin', color: '#ff8f00' },
      { value: 0.05, type: 'coin', color: '#bf360c' },
      { value: 0.02, type: 'coin', color: '#bf360c' },
      { value: 0.01, type: 'coin', color: '#bf360c' }
    ]
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    denominations: [
      { value: 100, type: 'note', color: '#27ae60' },
      { value: 50, type: 'note', color: '#e67e22' },
      { value: 20, type: 'note', color: '#27ae60' },
      { value: 10, type: 'note', color: '#f1c40f' },
      { value: 5, type: 'note', color: '#95a5a6' },
      { value: 1, type: 'note', color: '#2c3e50' },
      
      { value: 0.25, type: 'coin', color: '#bdc3c7' }, // Quarter
      { value: 0.1, type: 'coin', color: '#bdc3c7' },  // Dime
      { value: 0.05, type: 'coin', color: '#bdc3c7' }, // Nickel
      { value: 0.01, type: 'coin', color: '#d35400' }  // Penny
    ]
  },
  {
    code: 'CHF',
    name: 'Schweizer Franken',
    symbol: 'CHF',
    denominations: [
      { value: 1000, type: 'note', color: '#8e44ad' },
      { value: 200, type: 'note', color: '#f39c12' },
      { value: 100, type: 'note', color: '#3498db' },
      { value: 50, type: 'note', color: '#27ae60' },
      { value: 20, type: 'note', color: '#e74c3c' },
      { value: 10, type: 'note', color: '#f1c40f' },
      
      { value: 5, type: 'coin', color: '#bdc3c7' },
      { value: 2, type: 'coin', color: '#bdc3c7' },
      { value: 1, type: 'coin', color: '#bdc3c7' },
      { value: 0.5, type: 'coin', color: '#bdc3c7' },
      { value: 0.2, type: 'coin', color: '#f39c12' },
      { value: 0.1, type: 'coin', color: '#f39c12' },
      { value: 0.05, type: 'coin', color: '#d35400' }
    ]
  }
];

export function getCurrency(code: string): Currency | undefined { return CURRENCY_CONFIG.find(currency => currency.code === code); }
export function getDefaultCurrency(): Currency { return CURRENCY_CONFIG[0]; }
