import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { c } from "../../../../../node_modules/@angular/cdk/a11y-module.d-DBHGyKoh";

export interface Drink {
  name: string;
  volume: number;
  alcoholPercentage: number;
  time: string;

  alcoholGrams: number;
  bacIncrease: number;
}

@Component({
  selector: 'app-alcohol-level',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
],
  templateUrl: './alcohol-level.component.html',
  styleUrl: './alcohol-level.component.css'
})
export class AlcoholLevelComponent implements OnInit {
  weight: number = 70;
  gender: 'male' | 'female' | 'other' = 'other';

  drinks: Drink[] = [];
  dataSource = new MatTableDataSource<Drink>();
  currentBAC: number = 0;

  showWarning: boolean = true;
  showInfo: boolean = true;

  displayedColumns: string[] = [
    'name', 'volume', 'alcoholPercentage', 'time',
    'alcoholGrams', 'bacIncrease'
  ];


  ngOnInit() {
    this.loadFromStorage();
    if (this.drinks.length === 0) {
      this.addEmptyDrink();
    }
    this.updateCurrentBAC();
  }

  private updateDataSource() {
    this.dataSource.data = [...this.drinks];
  }

  addEmptyDrink() {
    const currentTime = new Date();
    const timeString = currentTime.toTimeString().substring(0, 5);

    const newDrink: Drink = {
      name: `Getränk ${this.drinks.length + 1}`,
      volume: 0,
      alcoholPercentage: 0,
      time: timeString,
      alcoholGrams: 0,
      bacIncrease: 0
    };

    this.drinks = [...this.drinks, newDrink];
    this.updateDataSource();
    this.saveToStorage();
  }

  calculateDrink(drink: Drink) {
    drink.alcoholGrams = drink.volume && drink.alcoholPercentage ?
      (drink.volume * drink.alcoholPercentage / 100) * 0.789 : 0;

    if (this.weight > 0 && drink.alcoholGrams > 0) {
      const distributionFactor = this.getDistributionFactor();
      drink.bacIncrease = (drink.alcoholGrams) / (this.weight * distributionFactor);
    } else {
      drink.bacIncrease = 0;
    }

    this.updateCurrentBAC();
    this.checkAndAddEmptyRow(drink);
    this.saveToStorage();
  }

  private getDistributionFactor(): number {
    switch (this.gender) {
      case 'male': return 0.7;
      case 'female': return 0.6;
      case 'other': return 0.65;
      default: return 0.65;
    }
  }

  private checkAndAddEmptyRow(drink: Drink) {
    const isComplete = this.isDrinkComplete(drink);

    if (isComplete) {
      const currentIndex = this.drinks.indexOf(drink);
      const remainingDrinks = this.drinks.slice(currentIndex + 1);
      const hasEmptyRow = remainingDrinks.some(d => !this.isDrinkComplete(d));

      if (!hasEmptyRow) {
        this.addEmptyDrink();
      }
    }
  }

  onDrinkChange(drink: Drink) {
    this.calculateDrink(drink);
  }

  onPersonalDataChange() {
    this.drinks.forEach(drink => {
      if (this.isDrinkComplete(drink)) {
        this.calculateDrink(drink);
      }
    });
    this.updateDataSource();
    this.updateCurrentBAC();
    this.saveToStorage();
  }

  private updateCurrentBAC() {
    this.currentBAC = this.calculateCurrentBAC();
  }

  private saveToStorage() {
    const data = {
      weight: this.weight,
      gender: this.gender,
      drinks: this.drinks
    };
    localStorage.setItem('alcohol-level-data', JSON.stringify(data));
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('alcohol-level-data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.weight = data.weight || 70;
        this.gender = data.gender || 'other';
        this.drinks = data.drinks || [];
        this.updateDataSource();
      } catch (error) {
        console.warn('Fehler beim Laden der Alkohol-Daten:', error);
        this.clearStorage();
      }
    }
  }

  private clearStorage() {
    localStorage.removeItem('alcohol-level-data');
  }

  resetData() {
    this.drinks = [];
    this.currentBAC = 0;
    this.clearStorage();
    this.addEmptyDrink();
    this.updateDataSource();
  }

  isDrinkComplete(drink: Drink): boolean {
    return !!(drink.volume > 0 && drink.alcoholPercentage > 0 && drink.time);
  }

  private calculateCurrentBAC(): number {
    const currentTime = new Date();
    let totalBAC = 0;

    this.drinks.forEach(drink => {
      if (this.isDrinkComplete(drink)) {
        const drinkTime = this.parseTime(drink.time);
        if (drinkTime) {
          const hoursElapsed = (currentTime.getTime() - drinkTime.getTime()) / 3600000;

          const bacReduction = Math.max(0, hoursElapsed * 0.15);
          const currentDrinkBAC = Math.max(0, drink.bacIncrease - bacReduction);

          totalBAC += currentDrinkBAC;
        }
      }
    });

    return totalBAC;
  }

  private parseTime(timeString: string): Date | null {
    if (!timeString) return null;

    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    if (date > new Date()) date.setDate(date.getDate() - 1);

    return date;
  }
}
