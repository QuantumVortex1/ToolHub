import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Currency, CurrencyDenomination, getCurrency, getDefaultCurrency } from '../../../conf/currency.config';

export interface CashCount {
  denomination: CurrencyDenomination;
  count: number | null;
  total: number;
}

export interface CheckoutData {
  selectedCurrency: Currency;
  cashCounts: CashCount[];
  coinRolls: number | null;
  receipts: number | null;
  cardPayments: number | null;
  startingCash: number | null;
  totalCash: number;
  finalAmount: number;
}

@Component({
  selector: 'app-checkout-helper',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './checkout-helper.component.html',
  styleUrl: './checkout-helper.component.css'
})
export class CheckoutHelperComponent implements OnInit {
  
  checkoutData: CheckoutData = {
    selectedCurrency: getDefaultCurrency(),
    cashCounts: [],
    coinRolls: null,
    receipts: null,
    cardPayments: null,
    startingCash: null,
    totalCash: 0,
    finalAmount: 0
  };

  availableCurrencies = [
    { code: 'EUR', name: 'Euro' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'CHF', name: 'Schweizer Franken' }
  ];

  ngOnInit() {
    this.initializeCashCounts();
    this.loadFromStorage();
    this.calculateTotals();
  }

  private initializeCashCounts() {
    this.checkoutData.cashCounts = this.checkoutData.selectedCurrency.denominations.map(denomination => ({
      denomination,
      count: null,
      total: 0
    }));
  }

  onCurrencyChange(selectedCode: string) {
    const currency = getCurrency(selectedCode);
    if (currency) {
      this.checkoutData.selectedCurrency = currency;
      this.initializeCashCounts();
      this.calculateTotals();
      this.saveToStorage();
    }
  }

  onCountChange(cashCount: CashCount) {
    cashCount.total = (cashCount.count || 0) * cashCount.denomination.value;
    this.calculateTotals();
    this.saveToStorage();
  }

  onAdditionalCashChange() {
    this.calculateTotals();
    this.saveToStorage();
  }

  private calculateTotals() {
    this.checkoutData.totalCash = this.checkoutData.cashCounts.reduce(
      (sum, cashCount) => sum + cashCount.total, 0
    );
    this.checkoutData.totalCash += (this.checkoutData.coinRolls || 0) + 
                                   (this.checkoutData.receipts || 0) + 
                                   (this.checkoutData.cardPayments || 0);
    this.checkoutData.finalAmount = this.checkoutData.totalCash - (this.checkoutData.startingCash || 0);
  }

  resetData() {
    this.checkoutData.cashCounts.forEach(cashCount => {
      cashCount.count = null;
      cashCount.total = 0;
    });
    this.checkoutData.coinRolls = null as any;
    this.checkoutData.receipts = null as any;
    this.checkoutData.cardPayments = null as any;
    this.checkoutData.startingCash = null as any;
    this.calculateTotals();
    this.clearStorage();
  }

  get notes(): CashCount[] { return this.checkoutData.cashCounts.filter(cc => cc.denomination.type === 'note'); }
  get coins(): CashCount[] { return this.checkoutData.cashCounts.filter(cc => cc.denomination.type === 'coin'); }

  private saveToStorage() {
    const data = {
      selectedCurrencyCode: this.checkoutData.selectedCurrency.code,
      cashCounts: this.checkoutData.cashCounts.map(cc => ({
        value: cc.denomination.value,
        count: cc.count
      })),
      coinRolls: this.checkoutData.coinRolls,
      receipts: this.checkoutData.receipts,
      cardPayments: this.checkoutData.cardPayments,
      startingCash: this.checkoutData.startingCash
    };
    localStorage.setItem('checkout-helper-data', JSON.stringify(data));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('checkout-helper-data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const currency = getCurrency(data.selectedCurrencyCode);
        if (currency) {
          this.checkoutData.selectedCurrency = currency;
          this.initializeCashCounts();
        }

        data.cashCounts?.forEach((storedCount: any) => {
          const cashCount = this.checkoutData.cashCounts.find(
            cc => cc.denomination.value === storedCount.value
          );
          if (cashCount) {
            cashCount.count = storedCount.count || null;
            cashCount.total = (cashCount.count || 0) * cashCount.denomination.value;
          }
        });

        this.checkoutData.coinRolls = data.coinRolls || data.rollsAndReceipts || null; // Backward compatibility
        this.checkoutData.receipts = data.receipts || null;
        this.checkoutData.cardPayments = data.cardPayments || null;
        this.checkoutData.startingCash = data.startingCash || null;
        
      } catch (error) { console.warn('Fehler beim Laden der Checkout-Daten:', error); }
    }
  }

  private clearStorage() { localStorage.removeItem('checkout-helper-data'); }
}
