import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

export interface Pizza {
  name: string;
  type: 'round' | 'rectangular';
  diameter?: number;
  length?: number;
  width?: number;
  price?: number;
  
  totalArea: number;
  usableArea: number;
  crustPercentage: number;
  pricePerUsableArea: number;
  usableAreaPerEuro: number;
  pricePerTotalArea: number;
  totalAreaPerEuro: number;
}

@Component({
  selector: 'app-pizza',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonToggleModule
  ],
  templateUrl: './pizza.component.html',
  styleUrl: './pizza.component.css'
})
export class PizzaComponent implements OnInit {
  
  crustThickness: number = 2.0;
  pizzas: Pizza[] = [];
  dataSource = new MatTableDataSource<Pizza>();
  showAreaPerEuro: boolean = false;
  
  displayedColumns: string[] = [
    'name', 'type', 'dimensions', 'price',
    'totalArea', 'usableArea', 'crustPercentage',
    'priceRatioUsable', 'priceRatioTotal'
  ];

  ngOnInit() {
    this.addEmptyPizza();
  }

  private updateDataSource() {
    this.dataSource.data = [...this.pizzas];
  }

  addEmptyPizza() {
    const newPizza: Pizza = {
      name: `Pizza ${this.pizzas.length + 1}`,
      type: 'round',
      diameter: undefined,
      totalArea: 0,
      usableArea: 0,
      crustPercentage: 0,
      pricePerUsableArea: 0,
      usableAreaPerEuro: 0,
      pricePerTotalArea: 0,
      totalAreaPerEuro: 0
    };
    
    this.pizzas = [...this.pizzas, newPizza];
    this.updateDataSource();
  }

  calculatePizza(pizza: Pizza) {
    if (pizza.type === 'round' && pizza.diameter) {
      const radius = pizza.diameter / 2;
      pizza.totalArea = Math.PI * Math.pow(radius, 2);
      const usableRadius = Math.max(0, radius - this.crustThickness);
      pizza.usableArea = Math.PI * Math.pow(usableRadius, 2);

    } else if (pizza.type === 'rectangular' && pizza.length && pizza.width) {
      pizza.totalArea = pizza.length * pizza.width;
      const usableLength = Math.max(0, pizza.length - 2 * this.crustThickness);
      const usableWidth = Math.max(0, pizza.width - 2 * this.crustThickness);
      pizza.usableArea = usableLength * usableWidth;

    } else {
      pizza.totalArea = 0;
      pizza.usableArea = 0;
    }

    pizza.crustPercentage = pizza.totalArea > 0 ? ((pizza.totalArea - pizza.usableArea) / pizza.totalArea) * 100 : 0;

    if (pizza.price && pizza.price > 0) {
      pizza.pricePerUsableArea = pizza.usableArea > 0 ? pizza.price / pizza.usableArea : 0;
      pizza.usableAreaPerEuro = pizza.usableArea / pizza.price;
      pizza.pricePerTotalArea = pizza.totalArea > 0 ? pizza.price / pizza.totalArea : 0;
      pizza.totalAreaPerEuro = pizza.totalArea / pizza.price;
    } else {
      pizza.pricePerUsableArea = 0;
      pizza.usableAreaPerEuro = 0;
      pizza.pricePerTotalArea = 0;
      pizza.totalAreaPerEuro = 0;
    }

    this.checkAndAddEmptyRow(pizza);
  }

  private checkAndAddEmptyRow(pizza: Pizza) {
    const isComplete = this.isPizzaComplete(pizza);
    
    if (isComplete) {
      const currentIndex = this.pizzas.indexOf(pizza);
      const remainingPizzas = this.pizzas.slice(currentIndex + 1);
      const hasEmptyRow = remainingPizzas.some(p => !this.isPizzaComplete(p));
      
      if (!hasEmptyRow) {
        this.addEmptyPizza();
      }
    }
  }

  onPizzaChange(pizza: Pizza) {
    this.calculatePizza(pizza);
  }

  onCrustThicknessChange() {
    this.pizzas.forEach(pizza => {
      if (this.isPizzaComplete(pizza)) {
        this.calculatePizza(pizza);
      }
    });
    this.updateDataSource();
  }

  isPizzaComplete(pizza: Pizza): boolean {
    const hasPrice = pizza.price! > 0;
    const hasDimensions = pizza.type === 'round' ? pizza.diameter! > 0 : pizza.length! > 0 && pizza.width! > 0;
    return !!(hasPrice && hasDimensions);
  }

  isBestPizza(pizza: Pizza): boolean {
    if (!this.isPizzaComplete(pizza)) return false;
    
    const completePizzas = this.pizzas.filter(p => this.isPizzaComplete(p));
    if (completePizzas.length <= 1) return false;
    
    let bestPizza = completePizzas[0];
    for (const p of completePizzas) {
      if (this.showAreaPerEuro) {
        // Höhere Werte sind besser bei Fläche pro Euro
        if (p.totalAreaPerEuro > bestPizza.totalAreaPerEuro) {
          bestPizza = p;
        }
      } else {
        // Niedrigere Werte sind besser bei Preis pro Fläche
        if (p.pricePerTotalArea > 0 && (bestPizza.pricePerTotalArea === 0 || p.pricePerTotalArea < bestPizza.pricePerTotalArea)) {
          bestPizza = p;
        }
      }
    }
    
    return pizza === bestPizza && this.isPizzaComplete(pizza);
  }
}
