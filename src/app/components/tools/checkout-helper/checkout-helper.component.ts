import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Currency, CurrencyDenomination, getCurrency, getDefaultCurrency } from '../../../conf/currency.config';
import jsPDF from 'jspdf';

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
  pdfTitle: string;
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
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './checkout-helper.component.html',
  styleUrl: './checkout-helper.component.css'
})
export class CheckoutHelperComponent implements OnInit {
  
  constructor(private dialog: MatDialog) {}

  checkoutData: CheckoutData = {
    selectedCurrency: getDefaultCurrency(),
    cashCounts: [],
    coinRolls: null,
    receipts: null,
    cardPayments: null,
    startingCash: null,
    totalCash: 0,
    finalAmount: 0,
    pdfTitle: 'Kassenauszählung'
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
    this.checkoutData.pdfTitle = 'Kassenauszählung';
    this.calculateTotals();
    this.clearStorage();
  }

  get notes(): CashCount[] { return this.checkoutData.cashCounts.filter(cc => cc.denomination.type === 'note'); }
  get coins(): CashCount[] { return this.checkoutData.cashCounts.filter(cc => cc.denomination.type === 'coin'); }

  saveToStorage() {
    const data = {
      selectedCurrencyCode: this.checkoutData.selectedCurrency.code,
      cashCounts: this.checkoutData.cashCounts.map(cc => ({
        value: cc.denomination.value,
        count: cc.count
      })),
      coinRolls: this.checkoutData.coinRolls,
      receipts: this.checkoutData.receipts,
      cardPayments: this.checkoutData.cardPayments,
      startingCash: this.checkoutData.startingCash,
      pdfTitle: this.checkoutData.pdfTitle
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

        this.checkoutData.coinRolls = data.coinRolls || null;
        this.checkoutData.receipts = data.receipts || null;
        this.checkoutData.cardPayments = data.cardPayments || null;
        this.checkoutData.startingCash = data.startingCash || null;
        this.checkoutData.pdfTitle = data.pdfTitle || 'Kassenauszählung';

      } catch (error) { console.warn('Fehler beim Laden der Checkout-Daten:', error); }
    }
  }

  private clearStorage() { localStorage.removeItem('checkout-helper-data'); }

  exportToPDF() {
    const dialogRef = this.dialog.open(PdfTitleDialogComponent, {
      width: '400px',
      data: { title: this.checkoutData.pdfTitle }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.checkoutData.pdfTitle = result;
        this.saveToStorage();
        this.generatePDF();
      }
    });
  }

  private generatePDF() {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('de-DE');
    const currentTime = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const bargeldSumme = this.checkoutData.totalCash - (this.checkoutData.coinRolls || 0) - (this.checkoutData.receipts || 0) - (this.checkoutData.cardPayments || 0);

    doc.setFontSize(18);
    doc.text(this.checkoutData.pdfTitle || 'Kassenauszählung', 20, 20);

    let yPos = 35;
    this.drawSectionHeader(doc, 'Bargeld', yPos);
    yPos += 8;

    this.drawTableHeaders(doc, ['Wert', 'Summe'], [22, 140], yPos);
    yPos += 2;
    doc.line(20, yPos, 190, yPos);
    yPos += 6;

    doc.setFontSize(9);

    this.notes.forEach(cashCount => {
      this.drawTableRow(doc, [
        `${cashCount.denomination.value}${this.checkoutData.selectedCurrency.symbol}`,
        cashCount.count?.toString() || '0',
        `${cashCount.total.toFixed(2)}${this.checkoutData.selectedCurrency.symbol}`
      ], [22, 80, 140], yPos);
      yPos += 5;
    });

    yPos += 3;

    this.coins.forEach(cashCount => {
      this.drawTableRow(doc, [
        `${cashCount.denomination.value}${this.checkoutData.selectedCurrency.symbol}`,
        cashCount.count?.toString() || '0',
        `${cashCount.total.toFixed(2)}${this.checkoutData.selectedCurrency.symbol}`
      ], [22, 80, 140], yPos);
      yPos += 5;
    });

    doc.line(20, yPos-3, 190, yPos-3);
    yPos += 2;
    doc.setFontSize(10);
    this.drawTableRow(doc, [
      'Bargeld gesamt:',
      `${bargeldSumme.toFixed(2)}${this.checkoutData.selectedCurrency.symbol}`
    ], [22, 140], yPos);
    yPos += 10;

    this.drawSectionHeader(doc, 'Weitere Positionen', yPos);
    yPos += 6;

    doc.setFontSize(9);
    this.drawTableRow(doc, [
      'Bargeld (Scheine + Münzen)',
      `${bargeldSumme.toFixed(2)}${this.checkoutData.selectedCurrency.symbol}`
    ], [22, 140], yPos);
    yPos += 5;

    if (this.checkoutData.coinRolls && this.checkoutData.coinRolls > 0) {
      this.drawTableRow(doc, [
        'Münzrollen',
        `${this.checkoutData.coinRolls.toFixed(2)}${this.checkoutData.selectedCurrency.symbol}`
      ], [22, 140], yPos);
      yPos += 5;
    }

    if (this.checkoutData.receipts && this.checkoutData.receipts > 0) {
      this.drawTableRow(doc, [
        'Belege/Gutscheine',
        `${this.checkoutData.receipts.toFixed(2)}${this.checkoutData.selectedCurrency.symbol}`
      ], [22, 140], yPos);
      yPos += 5;
    }

    if (this.checkoutData.cardPayments && this.checkoutData.cardPayments > 0) {
      this.drawTableRow(doc, [
        'Kartenzahlungen',
        `${this.checkoutData.cardPayments.toFixed(2)}${this.checkoutData.selectedCurrency.symbol}`
      ], [22, 140], yPos);
      yPos += 5;
    }

    doc.line(20, yPos-3, 190, yPos-3);
    yPos += 2;

    doc.setFontSize(10);
    this.drawTableRow(doc, [
      'Gesamtumsatz',
      `${this.checkoutData.totalCash.toFixed(2)}${this.checkoutData.selectedCurrency.symbol}`
    ], [22, 140], yPos);
    yPos += 6;

    if (this.checkoutData.startingCash && this.checkoutData.startingCash > 0) {
      this.drawTableRow(doc, [
        'Abzug Anfangsgeld',
        `-${this.checkoutData.startingCash.toFixed(2)}${this.checkoutData.selectedCurrency.symbol}`
      ], [22, 140], yPos);
      yPos += 6;
    }

    doc.setLineWidth(0.7);
    doc.line(20, yPos-3, 190, yPos-3);
    yPos += 4;

    doc.setFontSize(14);
    doc.text('Gesamtgewinn', 20, yPos);
    doc.text(`${this.checkoutData.finalAmount.toFixed(2)}${this.checkoutData.selectedCurrency.symbol}`, 185, yPos, { align: 'right' });
    
    doc.setLineWidth(0.3);
    doc.line(125, 270, 185, 270);
    
    doc.setFontSize(8);
    doc.text('Unterschrift', 125, 274);

    doc.text(`Datum: ${currentDate}`, 185, 274, { align: 'right' });

    const sanitizedTitle = this.checkoutData.pdfTitle.replace(/[^a-zA-Z0-9-_äöüÄÖÜß\s]/g, '').trim();
    const fileName = `${sanitizedTitle}_${currentDate.replace(/\./g, '-')}_${currentTime.replace(/:/g, '-')}.pdf`;
    doc.save(fileName);
  }

  private drawSectionHeader(doc: jsPDF, title: string, yPos: number) {
    doc.setFontSize(12);
    doc.text(title, 20, yPos);
  }

  private drawTableHeaders(doc: jsPDF, headers: string[], positions: number[], yPos: number) {
    doc.setFontSize(10);
    headers.forEach((header, index) => {
      if (index === headers.length - 1) doc.text(header, positions[index] + 45, yPos, { align: 'right' });
      else doc.text(header, positions[index], yPos);
    });
  }

  private drawTableRow(doc: jsPDF, values: string[], positions: number[], yPos: number, rightAlignLast: boolean = true) {
    values.forEach((value, index) => {
      if (rightAlignLast && index === values.length - 1) doc.text(value, positions[index] + 45, yPos, { align: 'right' });
      else doc.text(value, positions[index], yPos);
    });
  }
}

@Component({
  selector: 'pdf-title-dialog',
  template: `
    <h2 mat-dialog-title>PDF-Titel eingeben</h2>
    
    <mat-dialog-content class="dialog-content">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>PDF-Titel</mat-label>
        <input 
          matInput 
          [(ngModel)]="data.title"
          placeholder="z.B. Tagesabschluss 09.10.2025"
          #titleInput>
      </mat-form-field>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Abbrechen</button>
      <button mat-raised-button color="primary" (click)="onConfirm()" [disabled]="!data.title || !data.title.trim()">
        <mat-icon>picture_as_pdf</mat-icon>
        PDF erstellen
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    
    .dialog-content {
      min-width: 350px;
      padding: 20px !important;
    }
    
    mat-dialog-actions {
      padding: 8px;
    }
  `],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class PdfTitleDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PdfTitleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.data.title && this.data.title.trim()) {
      this.dialogRef.close(this.data.title.trim());
    }
  }
}
