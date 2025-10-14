import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

export interface Person {
  name: string;
  contributed: number | null;
  spent: number | null;
  settlement: number;
}

export interface ExpensesData {
  people: Person[];
  totalContributed: number;
  totalSpent: number;
  unallocatedAmount: number;
}

@Component({
  selector: 'app-expenses-splitter',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './expenses-splitter.component.html',
  styleUrl: './expenses-splitter.component.css'
})
export class ExpensesSplitterComponent implements OnInit {
  
  expensesData: ExpensesData = {
    people: [],
    totalContributed: 0,
    totalSpent: 0,
    unallocatedAmount: 0
  };

  dataSource = new MatTableDataSource<Person>();
  displayedColumns: string[] = ['name', 'contributed', 'spent', 'settlement', 'actions'];

  ngOnInit(): void {
    this.loadFromStorage();
    if (this.expensesData.people.length === 0) {
      this.addEmptyPerson();
    }
    this.calculateTotals();
    this.updateDataSource();
  }

  private updateDataSource(): void {
    this.dataSource.data = [...this.expensesData.people];
  }

  addEmptyPerson(): void {
    const newPerson: Person = {
      name: '',
      contributed: null,
      spent: null,
      settlement: 0
    };
    
    this.expensesData.people = [...this.expensesData.people, newPerson];
    this.updateDataSource();
    this.saveToStorage();
  }

  onPersonChange(person: Person): void {
    this.calculateTotals();
    this.checkAndAddEmptyRow(person);
    this.saveToStorage();
  }

  private checkAndAddEmptyRow(person: Person): void {
    const isComplete = this.isPersonComplete(person);

    if (isComplete) {
      const currentIndex = this.expensesData.people.indexOf(person);
      const remainingPeople = this.expensesData.people.slice(currentIndex + 1);
      const hasEmptyRow = remainingPeople.some(p => !this.isPersonComplete(p));

      if (!hasEmptyRow) {
        this.addEmptyPerson();
      }
    }
  }

  isPersonComplete(person: Person): boolean {
    return !!(person.name && person.name.trim()) || 
           (person.contributed !== null && person.contributed > 0) ||
           (person.spent !== null && person.spent > 0);
  }

  removePerson(person: Person): void {
    this.expensesData.people = this.expensesData.people.filter(p => p !== person);
    this.updateDataSource();
    this.calculateTotals();
    this.saveToStorage();
    
    if (this.expensesData.people.length === 0) {
      this.addEmptyPerson();
    }
  }

  private calculateTotals(): void {
    this.expensesData.totalContributed = this.expensesData.people.reduce(
      (sum, person) => sum + (person.contributed || 0), 0
    );
    this.expensesData.totalSpent = this.expensesData.people.reduce(
      (sum, person) => sum + (person.spent || 0), 0
    );
    this.expensesData.unallocatedAmount = this.expensesData.totalContributed - this.expensesData.totalSpent;
    this.calculateSettlements();
  }

  private calculateSettlements(): void {
    const completePeople = this.expensesData.people.filter(p => this.isPersonComplete(p));
    if (completePeople.length === 0) return;

    this.expensesData.people.forEach(person => {
      if (this.isPersonComplete(person)) {
        const contributed = person.contributed || 0;
        const spent = person.spent || 0;
        person.settlement = contributed - spent;
      }
    });

    this.updateDataSource();
  }

  distributeUnallocated(): void {
    const completePeople = this.expensesData.people.filter(p => this.isPersonComplete(p));
    const peopleCount = completePeople.length;
    if (peopleCount === 0 || this.expensesData.unallocatedAmount <= 0) return;
    const amountPerPerson = this.expensesData.unallocatedAmount / peopleCount;

    completePeople.forEach(person => {
      const currentSpent = person.spent || 0;
      person.spent = currentSpent + amountPerPerson;
    });

    this.calculateTotals();
    this.saveToStorage();
  }

  resetAll(): void {
    this.expensesData.people = [];
    this.expensesData.totalContributed = 0;
    this.expensesData.totalSpent = 0;
    this.expensesData.unallocatedAmount = 0;
    
    this.addEmptyPerson();
    this.updateDataSource();
    this.clearStorage();
  }

  private saveToStorage(): void {
    const data = {
      people: this.expensesData.people.map(p => ({
        name: p.name,
        contributed: p.contributed,
        spent: p.spent
      }))
    };
    sessionStorage.setItem('expenses-splitter-data', JSON.stringify(data));
  }

  private loadFromStorage(): void {
    const stored = sessionStorage.getItem('expenses-splitter-data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        
        this.expensesData.people = (data.people || []).map((p: any) => ({
          name: p.name || '',
          contributed: p.contributed,
          spent: p.spent,
          balance: 0,
          settlement: 0
        }));

      } catch (error) {
        console.warn('Fehler beim Laden der Ausgabenaufteilungs-Daten:', error);
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    sessionStorage.removeItem('expenses-splitter-data');
  }

  getSettlementColor(settlement: number): string {
    if (settlement > 0.01) return 'positive';
    if (settlement < -0.01) return 'negative';
    return 'neutral';
  }

  getSettlementText(settlement: number): string {
    if (settlement > 0.01) return `Bekommt ${settlement.toFixed(2)}€`;
    if (settlement < -0.01) return `Schuldet ${Math.abs(settlement).toFixed(2)}€`;
    return 'Ausgeglichen';
  }
}
